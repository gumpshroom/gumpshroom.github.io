var pagesContaining = []
var pdfDocument = null
//add highlight, advanced search

const PRESETS = {
    "AK": ["Expansion Joint, Precompressed Silicone Coated", "Expansion Joint, Silicone", "Expansion Joint, Strip Seal", "Expansion Joint, Modular Bridge Joint System", "Expansion Joint, Compression", "Polyester polymer concrete overlay"],
    "AZ": ["DECK JOINT ASSEMBLY (FLANGELESS STRIP SEAL)", "REPLACE BRIDGE DECK JOINT SEAL (2X2 COMPRESSION SEAL)", "DECK JOINT ASSEMBLY (2X2 COMPRESSION SEAL)", "DECK JOINT ASSEMBLY (STRIP SEAL JOINT)", "REPLACE BRIDGE DECK JOINT SEAL (NEOPRENE SEAL)", "MISCELLANEOUS WORK (MODIFY BRIDGE DECK JOINT)", "MISCELLANEOUS WORK (BRIDGE JOINT SYSTEM TWO-PART SILICONE JOINT SEALANT)", "MISCELLANEOUS WORK (APPROACH SLAB JOINT ASSEMBLY)", "MISCELLANEOUS WORK (REPLACE JOINT SEALANT)", "MISCELLANEOUS WORK (BRIDGE DECK JOINT REPAIR)", "REPLACE BRIDGE DECK JOINT SEAL (MODULAR SEAL)", "DECK JOINT ASSEMBLY (MODULAR)", "REPLACE BRIDGE DECK SEAL ", "POLYESTER POLYMER CONCRETE OVERLAY"],
    "CA": ['JOINT SEAL (MR 1")', 'JOINT SEAL (MR 1 1/2")', 'JOINT SEAL ASSEMBLY (MR 2 1/2")', 'JOINT SEAL ASSEMBLY (MR 3")', 'JOINT SEAL ASSEMBLY (MR 4")', 'JOINT SEAL ASSEMBLY (MR 5")', 'JOINT SEAL ASSEMBLY (MR 5 1/2")', 'JOINT SEAL ASSEMBLY (MR 6")', 'JOINT SEAL ASSEMBLY (MR 7")', 'JOINT SEAL ASSEMBLY (MR 9")', 'JOINT SEAL ASSEMBLY (MR 11")', 'JOINT SEAL ', 'JOINT SEAL (ASPHALTIC PLUG)', 'JOINT SEAL (SILICONE)', 'JOINT SEAL (PREFORMED COMPRESSION)', 'JOINT SEAL (OVERLAY)', 'CLEAN EXPANSION JOINT', 'ISOLATION JOINT SEAL (ASPHALT RUBBER)', 'ISOLATION JOINT SEAL (SILICONE)', 'ISOLATION JOINT SEAL (PREFORMED COMPRESSION)', 'BONDED JOINT SEAL', 'PLATE JOINT SEAL ASSEMBLY', 'REPLACE JOINT SEAL (SILICONE)', 'RECONSTRUCT JOINT ARMOR', 'MOLDED REINFORCED ELASTOMERIC EXPANSION JOINT SEAL ASSEMBLY (MR 3")', 'DECK JOINT SEALANT', 'NEOPRENE STRIP SEAL GLAND', 'POLYESTER CONCRETE OVERLAY', 'POLYESTER CONCRETE EXPANSION DAM'],
    "CO": ['Bridge Expansion Device (Gland) (0-4 Inches)', 'Bridge Expansion Device (0-2 Inch)', 'Bridge Expansion Device (0-4 Inch)', 'Bridge Expansion Device (0-5 Inch)', 'Bridge Expansion Device (0-9 Inch)', 'Bridge Expansion Device (0-12 Inch)', 'Clean Expansion Joint', 'Bridge Expansion Joint (Asphaltic Plug)', 'Bridge Expansion Cover Plate', 'Bridge Expansion Device (Special)', 'Rapid Cure Silicone Joint Seal', 'Sawing and Sealing Bridge Joint', 'Bridge Compression Joint Sealer', 'Joint Sealant', 'Roadway Compression Joint Sealer', 'Thin Bonded Overlay (polyester concrete)'],
    "HI": ['expansion joint', 'expansion joint cover plate', 'Joint replace with cover plate', 'compression joint seal', 'PPC'],
    "ID": ['RESEALING JOINTS', 'SP BRIDGE MODULAR EXPANSION JOINTS', 'STRIP SEAL EXPANSION JOINT ', 'COMPRESSION EXPANSION JOINT', 'SP BRIDGE SILICONE SEALANT JOINT', 'SP BRIDGE SILICONE SEALANT EXPANSION JOINT', 'ASPHALTIC PLUG EXPANSION JOINT SYSTEM', 'ELASTOMERIC CONCRETE HEADER', 'POLYESTER JOINT HEADER', 'BRIDGE PPC HEADER, PPC OVERLAY'],
    "MT": ['JOINT SEALS-POLYURETHANE', 'EXPANSION JOINT-PRECOMPRESSED', 'REVISE JOINT', 'EXPANSION JOINT', 'JOINT SEALS-SILICONE', 'EXPANSION JOINT-MODULAR', 'REFURBISH EXPANSION JOINT', 'EXPANSION JOINT-ASPHALT PLUG', 'BRIDGE DECK CRACK SEAL', 'RESEALING EXISTING JOINTS', 'BRIDGE SUPERSTURCTURE, Bridge STRUCTURE', 'PPC OVERLAY'],
    "NV": ['PREFORMED JOINT FILLER', 'EXPANSION JOINT SEALANT', 'STRIP SEAL EXPANSION JOINT', 'COMPRESSION JOINT SEAL', 'ASPHALT PLUG EXPANSION JOINT ', 'POLYESTER POLYMER CONCRETE OVERLAY'],
    "NM": ['BRIDGE JOINT STRIP SEAL', 'POLYMER BRIDGE JOINT SEALS', 'PREFORMED SILICONE-COATED FOAM JOINT SYSTEM', 'BRIDGE JOINT ELASTOMER', 'PREFORMED CLOSED CELL FOAM BRIDGE JOINT SEALS', 'ELASTOMERIC COMPRESSION JOINT SEAL REPLACEMENT'],
    "OR": ['ASPHALTIC PLUG JOINT SEALS', 'STRIP SEALS', 'PREFORMED COMPRESSION JOINT SEALS', 'POURED SEALS', 'MODULAR BRIDGE JOINT SYSTEMS', 'EXPANSION JOINT', 'TERMINAL EXPANSION JOINT', 'EXPANSION JOINT REPAIR', 'MODULAR EXPANSION JOINT SEALS', 'MODULAR BRIDGE JOINT GLAND REPLACEMENTS', 'GLAND REPLACEMENT', 'STRIP SEAL GLAND', 'PREFORMED STRIP SEAL ELASTOMERIC GLAND REPLACEMENT', 'ELASTOMERIC CONCRETE NOSING', 'joint header repair', 'precompressed foam silicone joint seal ', 'polyester polymer concrete overlay'],
    "UT": ['ASPHALTIC PLUG JOINT', 'STRIP SEAL EXPANSION JOINT', 'MODULAR EXPANSION JOINT', 'COMPRESSION JOINT SEAL', 'POURABLE JOINT SEAL', 'JOINT SEALER', 'PPC'],
    "WA": ['EXPANSION JOINT MODIFICATION COMPRESSION SEAL', 'EXPANSION JOINT MODIFICATION REPL. HEADER ', 'EXPANSION JOINT MODIFICATION RCS & HEADER', 'EXPANSION JOINT MODIFICATION REPL. COMP. SEAL AND HEADER', 'EXPANSION JOINT MODIFICATION REPL. STRIP SEAL & HEADER', 'EXPANSION JOINT SYSTEM COMPRESSION SEAL', 'EXPANSION JOINT MODIFICATION', 'MODULAR EXPANSION JOINT SYSTEM', 'EXPANSION JOINT MODIFICATION RPL STRIP SEAL GLAND', 'JOINT REHABILITATION', 'POLYESTER OR ELASTOMERIC EXPANSION JOINT HEADER', 'EXPANSION JOINT MODIFICATION SILICOFLEX & STEEL BRACKET', 'STRUCTURAL STEEL DECK EXPANSION JOINTS', 'EXPANSIN JOINT MODIFICATION SILICONE GLAND', 'HMA JOINT SEALANT BRIDGE END', 'POLYESTER CONCRETE OVERLAY'],
    "WY": ['elastomeric compression seal', 'expansion joint', 'compressed joint material', 'expansion joint gland', 'silicone joint sealant']
}


function importData(fromURL) {
    pagesContaining = []
    if (fromURL === -1) {
        alert("error")
        return
    }
    if (!fromURL) {
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
    } else {
        loadPdf(fromURL)

    }
}

function loadPdf(pdfData) {
    console.log("loading")
    // Loaded via <script> tag, create shortcut to access PDF.js exports.
    var { pdfjsLib } = globalThis;

    console.log(globalThis)

    // The workerSrc property shall be specified.
    pdfjsLib.GlobalWorkerOptions.workerSrc = '../build/pdf.worker.mjs';

    var pageNum = 1,
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


    //load the docukemt 
    function loadDockewment(pdfDocument_) {
        pdfDocument = pdfDocument_;

        function searchHandler(qs) {
            pagesContaining = []
            var finishedPages = 0
            var everything = []
            var onlyWordsWithSeparators = qs.split(/\s*(AND|OR|NOT)+\s*/g).filter(Boolean);
            console.log(onlyWordsWithSeparators)
            for (var g = 0; g < onlyWordsWithSeparators.length; g++) {
                onlyWordsWithSeparators[g] = { str: onlyWordsWithSeparators[g], i: g }
                everything.push(onlyWordsWithSeparators[g])
            }

            //var signs = qs.match(/(AND|OR|NOT)/g) || []
            for (var i = 0; i < everything.length; i++) {
                switch (everything[i].str) {
                    case "AND":
                        everything[i].str = "&&"
                        break
                    case "OR":
                        everything[i].str = "||"
                        break
                    case "NOT":
                        everything[i].str = "!"
                        break
                    default:
                        if (!everything[i].str.match(/(AND|OR|NOT)/)) {
                            everything[i].str = "t.includes('" + everything[i].str.toLowerCase() + "')"
                        }
                        break
                }
            }
            everything.sort((a, b) => {
                a.i - b.i
            })
            console.log(everything)
            var str = "var t = fullText.toLowerCase(); ("
            for (var p = 0; p < everything.length - 1; p++) {
                str += everything[p].str + " "
            }
            str += everything[everything.length - 1].str + ")"
            var alerted = false
            console.log(str)

            for (var x = 1; x <= pdfDocument.numPages; x++) {
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

                    /*if (fullText.toLowerCase().includes(searchTerm.toLowerCase())) {
                        pagesContaining.push(page.pageNumber)
                    } */
                    //parse stuff
                    //use 'eval'
                    //first change to a readable expression

                    var result = false
                    try {
                        result = eval(str)
                    } catch {
                        if (!alerted) {
                            alert("invalid query")
                            alerted = true
                        }
                        return
                    }
                    if (result) {
                        pagesContaining.push(page.pageNumber)
                    }
                    if (pagesContaining.length !== 0) {
                        document.getElementById("pagesContaining").innerHTML = "pages containing '" + qs + "':\n\n" + pagesContaining.length
                    } else {
                        document.getElementById("pagesContaining").innerHTML = "no instances of '" + qs + "' found"
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

        document.getElementById('page_count').textContent = pdfDocument.numPages;
        document.getElementById("search").disabled = null
        document.getElementById("searchDialog").addEventListener('close', function(e) {
            if (e.srcElement.returnValue === "load") {
                searchHandler(document.getElementById("searchText").value)
            }
        })
        document.getElementById("search").onclick = function() {
            document.getElementById("searchDialog").open = true
        }
        // Initial/first page rendering
        document.getElementById("loadingDialog").open = null
        renderPage(pageNum);
    }


    pdfjsLib.getDocument(pdfData).promise.then(loadDockewment).catch(function(e) {
        alert("error: " + e.message + " : " + e.name)
        document.getElementById("loadingDialog").open = null
    });

}
function changePreset(preset) {
    //TODO use "presets" obj, for now just do manually
    document.getElementById("searchText").value = PRESETS[preset] ? PRESETS[preset].join(" OR ") : ""
    console.log("changed preset " + preset)
}
