var pagesContaining = []

function importData() {
    pagesContaining = []
    let input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf'
    input.onchange = _ => {
        // you can use this method to get file and perform respective operations
        let file = Array.from(input.files)[0];
        var fileReader = new FileReader()
        fileReader.onload = function() {
            var arr = new Uint8Array(this.result)
            loadPdf(arr)
        }
        fileReader.readAsArrayBuffer(file);
    };
    input.click();
}
function loadPdf(pdfData) {
    console.log("loading")
    // Loaded via <script> tag, create shortcut to access PDF.js exports.
    var { pdfjsLib } = globalThis;

    console.log(globalThis)

    // The workerSrc property shall be specified.
    pdfjsLib.GlobalWorkerOptions.workerSrc = '../build/pdf.worker.mjs';

    var pdfDocument = null,
        pageNum = 1,
        pageRendering = false,
        pageNumPending = null,
        scale = 0.8,
        canvas = document.getElementById('the-canvas'),
        ctx = canvas.getContext('2d');

    /**
     * Get page info from document, resize canvas accordingly, and render page.
     * @param num Page number.
     */
    function renderPage(num) {

        pageRendering = true;
        // Using promise to fetch the page
        pdfDocument.getPage(num).then(function(page) {
            var viewport = page.getViewport({ scale: scale });
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            // Render PDF page into canvas context
            var renderContext = {
                canvasContext: ctx,
                viewport: viewport
            };
            var renderTask = page.render(renderContext);

            // Wait for rendering to finish
            renderTask.promise.then(function() {
                pageRendering = false;
                if (pageNumPending !== null) {
                    // New page rendering is pending
                    renderPage(pageNumPending);
                    pageNumPending = null;
                }
            });
        });
        /*const container = document.getElementById("viewerContainer");

        const eventBus = new pdfjsViewer.EventBus();

        // (Optionally) enable hyperlinks within PDF files.
        const pdfLinkService = new pdfjsViewer.PDFLinkService({
          eventBus,
        });

        // (Optionally) enable find controller.
        const pdfFindController = new pdfjsViewer.PDFFindController({
          eventBus,
          linkService: pdfLinkService,
        });

        // (Optionally) enable scripting support.
        const pdfScriptingManager = new pdfjsViewer.PDFScriptingManager({
          eventBus,
          sandboxBundleSrc: SANDBOX_BUNDLE_SRC,
        });

        const pdfViewer = new pdfjsViewer.PDFViewer({
          container,
          eventBus,
          linkService: pdfLinkService,
          findController: pdfFindController,
          scriptingManager: pdfScriptingManager,
        });
        pdfLinkService.setViewer(pdfViewer);
        pdfScriptingManager.setViewer(pdfViewer);

        eventBus.on("pagesinit", function () {
          // We can use pdfViewer now, e.g. let's change default scale.
          pdfViewer.currentScaleValue = "page-width";

          // We can try searching for things.
          if (SEARCH_FOR) {
            eventBus.dispatch("find", { type: "", query: SEARCH_FOR });
          }
        });
        // Document loaded, specifying document for the viewer and
        // the (optional) linkService.
        pdfViewer.setDocument(pdfDocument);

        pdfLinkService.setDocument(pdfDocument, null);
        */
        // Update page counters
        document.getElementById('page_num').textContent = num;
    }

    /**
     * If another page rendering in progress, waits until the rendering is
     * finised. Otherwise, executes rendering immediately.
     */
    function queueRenderPage(num) {
        if (pageRendering) {
            pageNumPending = num;
        } else {
            renderPage(num);
        }
    }

    /**
     * Displays previous page.
     */
    function onPrevPage() {
        if (pageNum <= 1) {
            return;
        }
        pageNum--;
        queueRenderPage(pageNum);
    }
    document.getElementById('prev').addEventListener('click', onPrevPage);


    document.getElementById('goto').addEventListener('click', function() {
        var prompted = parseInt(prompt("enter page number!"))
        if (prompted < 1 || prompted > pdfDocument.numPages) {
            alert("invalid page!")
            return
        } else {
            pageNum = prompted
            queueRenderPage(pageNum)
        }
    })
    /**
     * Displays next page.
     */
    function onNextPage() {
        if (pageNum >= pdfDocument.numPages) {
            return;
        }
        pageNum++;
        queueRenderPage(pageNum);
    }
    document.getElementById('next').addEventListener('click', onNextPage);

    /**
     * Asynchronously downloads PDF.
     */
    pdfjsLib.getDocument(pdfData).promise.then(function(pdfDocument_) {
        pdfDocument = pdfDocument_;
        
        document.getElementById('page_count').textContent = pdfDocument.numPages;
        document.getElementById("search").disabled = null
        document.getElementById("search").onclick = function() {
            pagesContaining = []
            var searchTerm = prompt("Enter a search term!")
            var finishedPages = 0
            for(var x = 1; x <= pdfDocument.numPages; x++) {
                var y = x
                pdfDocument.getPage(y).then(async function(page) {
                    var textStream = page.streamTextContent()
                    var chunks = []
                    var fullText = ""
                    for await (const chunk of textStream) {
                        chunks.push(chunk)
                    }
                    for (var i = 0; i < chunks.length; i++) {
                        for (var j = 0; j < chunks[i].items.length; j++) {
                            fullText += chunks[i].items[j].str
                        }
                    }

                    if (fullText.toLowerCase().includes(searchTerm.toLowerCase())) {
                        pagesContaining.push(page.pageNumber)
                    } 
                    if (pagesContaining.length !== 0) {
                        document.getElementById("pagesContaining").innerHTML = "pages containing '" + searchTerm + "':\n\n" + JSON.stringify(pagesContaining)
                    } else {
                        document.getElementById("pagesContaining").innerHTML = "no instances of '" + searchTerm + "' found"
                    }
                    finishedPages++
                    document.getElementById("progress").innerHTML = "please wait... searched " + finishedPages + "/" + pdfDocument.numPages + " pages"
                    if (finishedPages === pdfDocument.numPages) {
                        document.getElementById("progress").innerHTML = "done! press 'export' to save selected pages as new PDF"
                    }
                })
            }
        }
        document.getElementById("export").disabled = null
        document.getElementById("export").onclick = async function() {
            if (pagesContaining.length === 0) {
                alert("no instances of search term found!!!")
            } else {
                pagesContaining.sort()
                var rawData = await pdfDocument.getData()
                var pdfDoc = await PDFLib.PDFDocument.load(rawData)
                var pagesRemoved = 0
                for (var i = 1; i <= pdfDoc.getPageCount(); i++) {
                    if (!pagesContaining.includes(i + pagesRemoved)) {
                        pdfDoc.removePage(i - 1)
                        i--
                        pagesRemoved++
                    }
                }
                const pdfBytes = await pdfDoc.save()
                const blob = new Blob([pdfBytes], { type: "application/pdf" });
                const url = URL.createObjectURL(blob);
                window.open(url, '_blank');
            }
        }
        // Initial/first page rendering
        renderPage(pageNum);
    });
}