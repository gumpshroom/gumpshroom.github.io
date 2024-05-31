var pagesContaining = []
var pdfDocument = null
//add highlight, advanced search

var PRESETS = {
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
    "WY": ['elastomeric compression seal', 'expansion joint', 'compressed joint material', 'expansion joint gland', 'silicone joint sealant'],
    "IL": ['PREF JT STRIP SEAL', 'SILICONE JT SEAL  1', 'SILICONE JT SEAL  3/4', 'SILICONE JT SEAL  1', 'PED TRUSS SUPERSTR', 'JOINT SEALER', 'MODULAR EXPAN JT  6', 'PREF JOINT SEAL 2 1/2', 'CLEAN & SEAL JOINTS', 'POLYMER CONCRETE', 'EXPANSION JOINT REPAIR', 'FINGER PLATE EXPANSION JOINT', 'NEOPRENE EXPANSION JOINT', 'FABRIC REINFORCED ELASTOMERIC TROUGH', 'STRIP SEAL GLAND REPLACEMENT', 'BRIDGE DECK REPAIR JOINT SEALING', 'BONDED PREFORMED JOINT SEAL', 'EXPANSION JOINT MODIFICATION', 'PPC, POLYMER CONCRETE OVERLAY'],
    "IN": ['BRIDGE EXPANSION JOINT SEAL, M, REPLACE', 'BRIDGE EXPANSION JOINT, PCF', 'JOINT REPAIR, BOTTOM-HALF', 'JOINT REPAIR, PARTIAL DEPTH', 'TERMINAL JOINT, POLYMER MODIFIED ASPHALT', 'TERMINAL JOINT, RETROFIT POLYMER MODIFIED ASPHALT', 'TERMINAL JOINT, TYPE HMA', 'TERMINAL JOINT, TYPE PCCP', 'BRIDGE JOINT NOSING', 'STRUCTURAL EXPANSION JOINT SEALING SYS , REPAIR WITH NOSING', 'EXPANSION JOINT SLIDING PLATE', 'BRIDGE EXPANSION JOINT SEAL, SS, REPLACE', 'BRIDGE EXPANSION JOINT SEAL, PCF, REPLACE', 'BRIDGE EXPANSION JOINT, M', 'CONCRETE FOR PATCHING BRIDGE EXPANSION JOINT', 'PREFORMED SILICONE JOINT', 'EXPANSION JOINT WITH LOAD TRANSFER', 'SILICONE JIONT SEALANT', 'ASPHATIC PLUG JOINT', 'PPC, POLYESTER POLYMER CONFRETE , THIN BONDED OVERLAY', 'PPC FOR APPROACHES'],
    "IA": ['STEEL EXTRUSION JOINT W/NEOPRENE', 'NEOPRENE GLAND INSTALLATION + TESTING', 'PREFORMED, PRE-COMPRESSED, SELF-EXPANDING, SEALANT SYSTEM WITH SILICONE PRE-COATED SURFACE', 'PREFORMED ELASTIC NEOPRENE JOINT', 'COMPRESSION SEALS', 'MODULAR EXPANSION JOINT ASSEMBLY', 'EXPANSION JOINT (DRAINAGE SYSTEM)', 'EXPANSION JOINT (FINGER PLATES)', 'EXPANSION DEVICE (FINGER JOINT)', 'STEEL SIDEWALK EXPANSION JOINT COVER PLATE', 'ASPHALTIC PLUG EXPANSION JOINT', 'PREF PRECOMP S-E SEAL SYST W/ SILICONE', 'IMPREGNATED FOAM JOINT', 'POLYESTER POLYMER CONCRETE OVERLAY'],
    "KS": ['EXPANSION DEVICE (SLIDING PLATE)', 'EXPANSION JOINT (STRIP SEAL ASSEMBLY)', 'EXPANSION DEVICE (FINGER PLATE)', 'EXPANSION JOINT (MEMBRANE SEALANT POLY-TITE)', 'EXPANSION JOINT (MEMBRANE SEALANT)', 'BRIDGE APPROACH SLAB FOOTING', 'EXPANSION DEVICE (MODULAR)', 'EXPANSION JOINT (PREFORMED SILICONE)', 'POLYESTER POLYMER CONCRETE OVERLAY PPC'],
    "MI": ['Expansion Joint Device', 'Expansion Joint Device, Cover Plate', 'Preformed Neoprene Compression Joint Seal Replacement', 'Deck Joint, Rem', 'Joint, Expansion, E2, E3, ERG', 'Bridge Joint, Strip Seal Gland Replacement', 'Joint Waterproofing, Expansion', 'Preformed Neoprene Compression Joint Seal Replacement', 'Preformed Neoprene Compression Seal, 2 inch', 'Asphaltic Plug Expansion Joint System', 'Expansion Joint System, Modular', 'Bridge Joints, Clean and Seal', 'Modular Joint Gland Replacement', 'Joint Pressure Relief  ', 'Polyester Polymer Concrete Overlay', 'Finger Joints (Bascule Bridge)'],
    "MN": ['RECONSTRUCT EXP JOINT TYPE', 'EXPANSION JOINT DEVICES TYPE 4', 'EXPANSION JOINT DEVICES TYPE 5   ', 'EXPANSION JOINTS, DESIGN E8', 'EXPANSION JOINTS, DESIGN E8H', 'MODULAR BRIDGE JOINT SYSTEM ', 'clean and seal deck joints', 'polymer concrete PPC'],
    "MO": ['EXPANSION DEVICE (FLAT PLATE)', 'OPEN CELL FOAM JOINT SEAL', 'CLEAN AND FLUSH EXISTING EXPANSION JOINT SEAL', 'STRIP SEAL EXPANSION JOINT SYSTEM', 'MODULAR EXPANSION JOINT SYSTEM', 'SILICONE EXPANSION JOINT SEALANT', 'TYPE E EXPANSION JOINT', 'FINGER JOINT EXPANSION JOINT SYSTEM', 'PREFORMED SILICONE OR EPDM EXPANSION JOINT SEAL', 'OPEN CELL FOAM JOINT SYSTEM', 'Steel Reinforced Elastomeric Expansion Joint System', 'EXPANSION DEVICE (FINGER PLATE) WITH DRAINAGE TROUGH SYSTEM', 'polyester polymer concrete material', 'polymer concrete overlay'],
    "NE": ['BRIDGE JOINT NOSING', 'PREFORMED EXPANSION JOINT', 'ASPHALT PLUG JOINT SYSTEM', 'SEGMENTAL JOINT SEAL', 'PRECOMPRESSED POLYURETHANE FOAM JOINT  ', 'SAW AND SEAL JOINT', 'SEALING JOINTS', 'DECK JOINT SEAL, TYPE IV', 'STRIP SEALS', 'ARMORED COMPRESSION JIONT SYSTEM', 'POLYESTER CONCRETE OVERLAY'],
    "ND": ['POLYURETHANE FOAM JOINT SEAL', '3IN EXPANSION JOINT STRIP SEAL', 'EXPANSION JOINT STRIP SEAL', 'EXPANSION JOINT MODIFICATION', 'EXPANSION JOINT MODIFICATION-STRIP SEAL', 'FINGER EXPANSION JOINT', 'BRIDGE APPROACH SLAB-REMOVE & REPLACE', 'PREFORMED ELASTOMERIC COMPRESSION JOINT SEAL ', 'SILICONE SEALANT', 'DOWELED EXPANSION JOINT ASSEMBLY', 'EXPANSINO JIONT SILICONE SEAL', 'POLYESTER POLYMER CONCRETE OVERLAY'],
    "OH": ['SEMI INTEGRAL ABUTMENT EXPANSION JOINT SEAL', 'JOINT SEALER, APP', 'STR JOINT/SEALER, MISC.: SILICON SEAL', '2" DEEP JOINT SEALER, APP', 'STR JOINT/SEALER, MISC.: NEOPRENE SEAL', 'STR JOINT/SEALER, MISC.: COMPRESSED FOAM EXPANSION JOINT SEAL', 'POLYMER MODIFIED ASPHT EXP JOINT SYST', 'INTEGRAL ABUTMENT EXPANSION JOINT SEAL', 'SPECIAL - MODULAR EXPANSION JOINT', 'STRUCTURAL STEEL, MISC.: JOINT ARMOR, GALVANIZED', 'STR JOINT/SEALER, MISC.: EMSEAL WITH SLEEPER SLAB', 'STR JOINT/SEALER, MISC.: , 1.75" PRECOMPRESSED EXPANSION JOINT FILLER', 'PRFRMD ELSTMRC COMP SEAL, APP', 'ARMORLESS PRFRMD JT SL', 'ELST W/O STRIP SEAL STEEL EXTR', 'STRUC EXP JT INCL ELAST STRIP', 'ELST W/O STRIP SEAL STEEL EXTR, APP', 'ELST W/O STRIP SEAL STEEL EXTR, APP (SEAL REPLACEMENT)', 'STR JOINT/SEALER, MISC.: STRUCTURAL EXPANSION JOINT MODIFICATION EXCLUDING ELASTOMERIC STRIP SEAL', 'STRIP SEAL EXP JT ANCH W/ELAST CONC, APP', 'STR JOINT/SEALER, MISC.: JEENE SEAL WITH SLEEPER SLAB', 'ELAST COMP SEAL, APP', 'Strip Seal expansion joint anchored with elastomeric concrete sidewalk cover plate', 'polyester polymer concrete', 'polymer epoxy overlay'],
    "OK": ['RAPID CURE JOINT SEALANT ', 'PREFORMED SILICONE FOAM JOINTS ', 'SEALED EXPANSION JOINTS', 'MODULAR EXPANSION JOINT', 'FINGER TYPE EXPANSION DEVICE', 'EXPANSION JOINT SYSTEM', 'SILICONE CONSTRUCTION JOINT', 'ELASTOMERIC MORTAR', 'Preformed Silicone Expansion Joints ', 'Aluminum Finger Type Expansion Device', 'bridge deck concrete overlay, bonded concrete overlay, polymer concrete overlay', 'bonded P.C.C. overlay placement'],
    "SD": ['expansion device', 'asphalt bridge joint', 'membrane sealant expansion joint', 'finger type expansion joint assembly', 'replace expansion device', 'joint nosing material ', 'compression seal', 'strip seal expansion joint', 'strip seal gland', 'Inverted V shaped seal joint', 'PPC'],
    "TX": ['asphalt plug expansion joint', 'HEADER TYPE EXPANSION JOINT', 'BRIDGE JOINT REPAIR HEADER', 'CLEANING AND SEALING EXISTING JOINTS', 'CLEANING AND SEALING EXIST JOINTS(CL3)', 'CLEANING AND SEALING EXIST JOINTS(CL7)', 'CLEANING AND SEALING JOINTS (CL 7)', 'CLEANING EXISTING JOINTS', 'ARMOR JOINT (SEALED)', 'HEADER TYPE EXPANSION JOINT', 'HEADER TYPE EXPANSION JOINT', 'JOINT SEALANT', 'SEALED EXPANSION JOINT (4 IN) (SEJ - M)', 'SEALED EXPANSION JOINT (4 IN) (SEJ - B)', 'BRIDGE JOINT REPAIR (ARMOR)', 'BRIDGE JOINT REPLACEMENT (ARMOR)', 'BRIDGE JOINT REPLACEMENT (SEJ)', 'sealed expansion joint 5" sej-m', 'sealed expansion joint 4" sej-b', 'sealed expansion joint 4" sej-a', 'ARMOR JOINT (MOD)', 'Polyester Polymer Concrete Overlay PPC'],
    "WI": ['Expansion Joint Seal System', 'Expansion Device', 'Strip Seal Gland Replacement', 'Expansion Device Modular Special', 'Compression Joint Sealer Preformed Elastomeric', 'Silicone Bridge Joint Sealant', 'PREFORMED SILICONE JOINT SEAL', 'Joint Repair', 'Expansion Joint Seal System', 'Precompressed Foam Joint', 'Polyester Polymer Concrete Overlay', 'Polymer Overlay'],
    "CT": ['PREFORMED JOINT SEAL', 'ASPHALTIC PLUG EXPANSION JOINT SYSTEM', 'PREFABRICATED EXPANSION JOINT SYSTEM', 'CLEAN AND RESEAL EXISTING FILLED BRIDGE JOINTS', 'SAWING AND SEALING JOINTS', 'REPLACE JOINT SEAL', 'STRIP SEAL EXPANSION JOINT SYSTEM', 'FINGER JOINT', 'MODULAR EXPANSION JOINT', 'REMOVAL AND REPLACEMENT OF EXISTING BRIDGE DRAINAGE SYSTEM', 'ELASTOMERIC CONCRETE HEADER', 'ELASTOMERIC CONCRETE EXPANSION JOINT', 'ELASTOMERIC COMPRESSION SEAL', 'CLOSED CELL ELASTOMER', 'POLYESTER POLYMER CONCRETE OVERLAY', 'THIN POLYMER OVERLAY'],
    "DC": ['armored joint with neoprene strip seal'],
    "DE": ['PREFABRICATED EXPANSION JOINT SYSTEM', 'STRIP SEAL GLAND', 'ASPHALTIC PLUG JOINT', 'SILICONE JOINT SEAL', 'SILICONE COATED FOAM JOINT SEAL', 'CLOSED-CELL JOINT SEAL', 'COMPRESSION SEAL', 'MODULAR JOINT SYSTEM', 'POLYESTER POLYMER CONCRETE OVERLAY'],
    "ME": ['bridge joint modification', 'TROUGH SYSTEM FOR FINGER JOINT', 'expansion device compression seal', 'asphaltic plug joint', 'expansion device gland seal', 'closed cell seal', 'modify joint armor gland', 'bridge joint header concrete', 'gland seal', 'armorless bridge joint system', 'silicone coated compression foam', 'EXPANSION DEVICE - FINGER JOINT', 'expansion device asphaltic plug joint', 'elastomeric concrete header repair', 'PPC'],
    "MD": ['BRIDGE ROADWAY JOINTS EXPANSION JOINTS', 'POURABLE SILICONE JOINT SEAL', 'MODULAR DECK JOINT ', 'COMPRESSION JOINT SEAL', 'REPLACE JOINT TROUGH', 'RAPID SETTING CONCRETE FOR JOINT REPLACEMENT ', 'BRIDGE ROADWAY SEAL REPLACEMENT', 'SUPERSTRUCTURE CONCRETE FOR BRIDGE (HIDDEN ITEMS)', 'MODULAR JOINT REPAIR', 'STEEL JOINT ARMOR REPAIR'],
    "MA": ['PRECOMPRESSED IMPREGNATED FOAM JOINT SEALER', 'ASPHALTIC BRIDGE JOINT SYSTEM', 'MODULAR BRIDGE JOINT SYSTEM', 'PRE-COMPRESSED JOINT SEAL', 'ELASTOMERIC CONCRETE EXPANSION DAMS WITH PRE-COMPRESSED SEAL BRIDGE JOINT SYSTEM', 'UHPC EXPANSION DAMS WITH PRE-COMPRESSED SEAL BRIDGE JOINT SYSTEM', 'BRIDGE JOINT REHABILITATION', 'MODIFIED ASPHALTIC BRIDGE JOINT SYSTEM', 'PRE-COMPRESSED SEAL BRIDGE JOINT SYSTEM', 'SAWCUT BRIDGE JOINT SYSTEM', 'RAPID CURE EXTRUDED SILICONE RUBBER JOINT SEAL', 'PREFORMED COMPRESSION JOINT SEAL REPLACEMENT', 'ARMORED STEEL JOINT', 'HMA JOINT SEALANT', 'REMOVE AND REPLACE EXISTING DECK JOINT', 'SUBMERSIBLE PRECOMPRESSED IMPREGNATED FOAM JOINT SEALER', 'NEOPRENE STRIP SEAL REPLACEMENT', 'SAWING & SEALING JOINTS IN ASPHALT PAVEMENT AT BRIDGES', 'MEMBRANE WATERPROOFING FOR BRIDGE DECK REPAIRS', 'ELASTOMERIC HEADERS', 'ELASTOMERIC CONCRETE EXPANSION DAMS', 'ELASTOMERIC CONCRETE', 'NEOPRENE COMPRESSION SEAL FOR BRIDGE JOINT', 'RAPID CURE EXTRUDED SILICONE RUBBER JOINT SEAL', 'CLEANING BRIDGE DECK JOINTS', 'BRIDGE STRUCTURE (HIDDEN ITEMS)', 'PRECOMPRESSED JOINT SEAL WITH ELASTOMERIC CONCRETE HEADERS', 'ELASTOMERIC EXPANSION JOINT', 'PRECOMPRESSED JOINT SEALER', 'ULTRA THIN BONDED POLYMER OVERLAY'],
    "NH": ['PREFABRICATED STRIP SEAL EXPANSION JOINT', 'SILICONE JOINT SEALANT', 'ASPHALTIC PLUG FOR CRACK CONTROL', 'SILICONE JOINT SEALANT', 'COMPRESSION SEAL EXPANSION JOINT', 'PREFABRICATED MODULAR BRIDGE JOINT SYSTEM', 'PREFABRICATED MOLDED RUBBER SEGMENTAL EXPAN JOINT', 'PREFABRICATED FINGER EXPANSION JOINT'],
    "NJ": ['Joint Reconstruction', 'Joint Seal Replacement', 'Silicone Joint Seal', 'Modular Expansion Joint', 'Joint Replacement', 'Additional 1P Deck Joint Material', 'Deck Joint Reconstruction', 'Tooth-Joint Riser Plate Repair', 'Strip Seal Expansion Joints', 'PREFORMED ELASTOMERIC JOINT SEALER', 'DECK JOINT REPAIR', 'DECK JOINT RESEAL (SILICON)', 'STEEL DECK JOINT REPAIR', 'BRIDGE DECK CRACK SEALING', 'ASPHALTIC PLUG BRIDGE JOINT SYSTEM', 'PREFORMED ELASTOMERIC JIONT ASSEMBLY', 'POLYESTER POLYMER CONCRETE OVERLAY', 'CONCRETE BRIDGE DECK PPC'],
    "NY": ['ARMORLESS BRIDGE JOINT SYSTEM', 'MODULAR EXPANSION JOINT SYSTEM - ONE CELL', 'MODULAR EXPANSION JOINT SYSTEM - TWO CELL', 'MODULAR EXPANSION JOINT SYSTEM - THREE CELL', 'BRIDGE JOINT HEADER', 'BRIDGE JOINT SEAL', 'ELASTOMERIC EXPANSION JOINT SYSTEMS WITH WEAR PLATES', 'ASPHALTIC PLUG JOINTS FOR BRIDGES', 'RESEALING BRIDGE DECK JOINTS', 'REPLACING MODULAR SEAL FOR EXISTING BRIDGE JOINTS', 'SEALING EXISTING BRIDGE JOINTS', 'REPLACING COMPRESSION SEAL FOR EXISTING BRIDGE JOINTS', 'ELASTOMERIC EXPANSION JOINT SYSTEMS', 'ELASTOMERIC CONCRETE', 'BRIDGE JOINT SEAL FOAM-SUPPORTED SILICONE', 'ARMORED JOINT WITH COMPRESSION SEAL', 'SLEEPER SLAB (HIDDEN… SILICONE JOINT SEAL)', 'HYBRID COMPOSITE SYNTHETIC CONCRETE JOINT HEADER', 'POLYESTER POLYMER CONCRETE PPC'],
    "PA": ['tooth expansion dam with drain trough', 'neoprene strip seal dam ', 'bridge expansion joint system', 'strip seal gland', 'preformed neoprene compression seal', 'expansion dam replacement', 'asphaltic plug expansion dam', 'bridge expansion dam system ', 'expansion joint material replacement', 'EMSEAL BRIDGE EXPANSION JOINT SYSTEM', 'POLYMER MORTAR FOR BRIDGE JOINT EXPANSION DAM', 'SILICONE SEALANT FOR BRIDGE JOINT EXPANSION DAM', 'BRIDGE STRUCTURE (HIDDEN ITEMS)', 'MODULAR EXPANSION DEVICE', 'PRECOMPRESSED SILICONE AND FOAM HYBRID JOINT SEALING MATERIAL', 'SILICONE JOINT SEALING MATERIAL', 'FABRIC REINFORCED BRIDGE DRAIN TROUGH', 'ACCELERATED EXPANSION DAM REPLACEMENT', 'TWO PART RAPID CURE SILICONE SEALANT', 'BRIDGE EXPANSION JOINT SEAL SYSTEM', 'TRANSFLEX JOINT ', 'NEOPRENE STRIP SEAL GLAND REPLACEMENT', 'REPAIR DECK JOINT DRAIN TROUGH', 'POLYESTER POLYMER CONCRETE OVERLAY'],
    "RI": ['SILICONE HIGHWAY JOINT SEALER', 'asphaltic expansion joint system', 'polyurethane elastomeric joint seal', 'strip seal expansion joints', 'precompressed joint seal ', 'modular expansion joint assembly'],
    "VT": ['BRIDGE EXPANSION JOINT, ASPHALTIC PLUG', 'BRIDGE EXPANSION JOINT, FINGER PLATE', 'BRIDGE EXPANSION JOINT, STRIP SEAL', 'PRECOMPRESSED SEAL BRIDGE JIONT'],
    "allWBA": ['modular', 'expansion', 'joint', 'finger', 'tooth', 'plan view', 'watson bowman', 'anchor stud', 'anchor studs', 'temperature', 'sidewalk cover', 'cover plate', 'slope', 'wabo', 'transflex', 'waboflex']
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
                        document.getElementById("pagesContaining").innerHTML = "nothing found yet. please wait for search"
                    }
                    finishedPages++
                    document.getElementById("progress").innerHTML = "please wait... searched " + finishedPages + "/" + pdfDocument.numPages + " pages"
                    if (finishedPages === pdfDocument.numPages) {
                        document.getElementById("progress").innerHTML = "done! press 'export' to save selected pages as new PDF"
                        if (pagesContaining.length === 0) {
                            alert("no instances of query found! pdf might not be searchable. try OCR on it first.")
                            document.getElementById("pagesContaining").innerHTML = "no instances of '" + qs + "' found"
                        }
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
                //location.reload()
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
    document.getElementById("searchText").value = PRESETS[preset] ? PRESETS[preset].join(" OR ") : ""
    console.log("changed preset " + preset)
}
