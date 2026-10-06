// Opens the browser's print window. From there the visitor can print, or choose "Save as PDF" as the printer.
// The browser uses the page title as the PDF file name, so we set a clear one while printing.
export function printReceipt(orderId?: string) {
    const previousTitle = document.title;
    document.title = orderId ? `The Look receipt ${orderId.slice(-6).toUpperCase()}` : "The Look receipt";
    window.addEventListener("afterprint", () => { document.title = previousTitle; }, { once: true });
    window.print();
}
