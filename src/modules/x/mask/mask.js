
// Convenience function for converting NodeLists.
const slice = Array.prototype.slice;

export default class Observer {
    constructor(rootElement) {
        this.observerConfig = {
            childList: true,
            subtree: true,
            attributes: true,
        };
        this.shadowObserverConfig = { childList: true, subtree: true };

        const callback = (mutationList, observer) => {
          console.log('mutation',mutationList);
            for (const mutation of mutationList) {
                if (mutation.type === "childList") {
                    console.log("A child node has been added or removed.");
                } else if (mutation.type === "attributes") {
                    console.log(
                        `The ${mutation.attributeName} attribute was modified.`
                    );
                }
            }
        };
        this.observer = new MutationObserver(callback);
        this.shadowObserver = new MutationObserver((records) => {
            for (const record of records) {
                if (record.type !== "childList") {
                    return;
                }
                const addedElements = slice
                    .call(record.addedNodes)
                    .filter(
                        (element) => element.nodeType === Node.ELEMENT_NODE
                    );
                for (const added of addedElements) {
                    const shadows = queryShadowsRoots(added);
                    for (const shadow of shadows) {
                        this.observe(shadow.shadowRoot);
                    }
                }
            }
        });

        // observe rootElement
        this.observe(rootElement);
        // observe nested shadows of rootElement
        const shadows = queryShadowsRoots(rootElement);
        debugger;
        for (const shadow of shadows) {
            this.observe(shadow.shadowRoot);
        }
    }

    observe(element) {
        this.observer.observe(element, this.observerConfig);
        this.shadowObserver.observe(element, this.shadowObserverConfig);
    }
}

function getDocument(element) {
    if (element.nodeType === Node.DOCUMENT_NODE) {
        return element;
    }

    return element.ownerDocument;
}

const filter = function (node) {
    if (node.shadowRoot) {
        return NodeFilter.FILTER_ACCEPT;
    }

    return NodeFilter.FILTER_SKIP;
};

function queryShadowsRoots(rootElement) {
    const doc = getDocument(rootElement);
    const walker = doc.createTreeWalker(
        rootElement,
        NodeFilter.SHOW_ELEMENT,
        filter,
        false
    );

    let list = [];
    if (rootElement.shadowRoot) {
        list = [
            rootElement,
            ...list,
            ...queryShadowsRoots(rootElement.shadowRoot),
        ];
    }
    while (walker.nextNode()) {
        list = [
            walker.currentNode,
            ...list,
            ...queryShadowsRoots(walker.currentNode.shadowRoot),
        ];
    }
    return list;
}
