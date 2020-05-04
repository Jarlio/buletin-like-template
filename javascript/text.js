var totalNumberOfDownloadPages = 0;
var lungimeBuletine = 0;


function generate() {
    var arr = Array.prototype.slice.call(document.getElementsByTagName('input'))
    arr.forEach(element => {
        var cor_spam = document.getElementById(element.getAttribute('name'));
        cor_spam.innerText = element.value;
    });
}

function start() {
    var index = document.getElementById("buletin-container-inputs").getAttribute("data-index");
    generateFromJson(parseInt(index));
}


function generateFromJson(index, callback) {
    /* read the json */
    var request = new XMLHttpRequest();
    request.open('GET', 'javascript/info.json', false); // `false` makes the request synchronous
    request.send(null);

    var buletine = [];
    if (request.status === 200) {
        buletine = JSON.parse(request.responseText)["buletine"];
    }
    lungimeBuletine = buletine.length;

    if (buletine[index]) {
        for (var elementIndex in buletine[index]) {
            var cor_spam = document.getElementById(elementIndex);
            cor_spam.innerText = buletine[index][elementIndex];
        }

        var mainBuletinContainer = document.getElementById("buletin-container-inputs");
        mainBuletinContainer.setAttribute("data-index", index);
        console.log(mainBuletinContainer.getAttribute("data-index"));
        if (callback) {
            callback(next);
        }
    } else {
        alert("Asta este ori primul ori ultimul buletin")
    }
}

function next(callback) {
    /* hard coded selection */
    var index = document.getElementById("buletin-container-inputs").getAttribute("data-index");
    console.log(index)
    generateFromJson(parseInt(index) + 1, callback);
}

function previous() {
    /* hard coded selection */
    var index = document.getElementById("buletin-container-inputs").getAttribute("data-index");
    console.log(index)
    generateFromJson(parseInt(index) - 1);
}

function rotate(element) {
    var utilityArray = element.id.split('-');
    var buletinIdentificator = utilityArray[utilityArray.length - 1]
    var spanInformator = document.getElementById("unghiRotatie-span-" + buletinIdentificator);
    spanInformator.innerText = element.value;
    var buletinContainer = document.getElementById("buletin-" + buletinIdentificator);
    var buletinShadow = document.getElementById("buletin-color-wrapper-" + buletinIdentificator);
    buletinContainer.style.transform = "rotate(" + element.value + "deg)";
    buletinShadow.style.transform = "rotate(" + element.value + "deg)";
}

function luminozity(element) {
    var utilityArray = element.id.split('-');
    var buletinIdentificator = utilityArray[utilityArray.length - 1]
    var spanInformator = document.getElementById("opacity-span-" + buletinIdentificator);
    spanInformator.innerText = element.value;
    var buletinContainer = document.getElementById("buletin-color-wrapper-" + buletinIdentificator);
    buletinContainer.style.opacity = element.value;
}

function setBackground(element) {
    var utilityArray = element.id.split('-');
    var buletinIdentificator = utilityArray[utilityArray.length - 1]
    var spanInformator = document.getElementById("color-span-" + buletinIdentificator);
    spanInformator.innerText = element.value;
    var buletinContainer = document.getElementById("buletin-color-wrapper-" + buletinIdentificator);
    buletinContainer.style.backgroundColor = element.value;
}

function download() {
    var node = document.getElementById('buletin-container-inputs');

    /* save image with html2image */
    var options = {
        // backgroundColor: "#ffffff",
        scale: 2
    };

    // html2canvas(node, options).then(canvas => {

    //     /* create a link, convert canvas into URL data, then pres the link button to download */
    //     var link = document.createElement('a');
    //     link.download = 'buletin.png';
    //     link.href = canvas.toDataURL("image/png");;
    //     link.click();

    // });

    domtoimage.toPng(node)
        .then(function (dataUrl) {
            var img = new Image();
            img.src = dataUrl;

            var link = document.createElement('a');
            link.download = 'buletin.png';
            link.href = img.src;
            link.click();

        })
        .catch(function (error) {
            console.error('oops, something went wrong!', error);
        });

}
var images = [];


function download_current(callback_next) {
    var node = document.getElementById('buletin-container-inputs');

    domtoimage.toPng(node)
        .then(function (dataUrl) {
            var img = new Image();
            img.src = dataUrl;

            var link = document.createElement('a');
            link.download = 'buletin' + totalNumberOfDownloadPages + '.png';
            link.href = img.src;
            link.click();

            var bar = document.getElementById('download-all-progress');
            bar.value += totalNumberOfDownloadPages;

            if (totalNumberOfDownloadPages < lungimeBuletine - 1) {
                totalNumberOfDownloadPages++;
                callback_next(download_current);
            }
        })
        .catch(function (error) {
            console.error('oops, something went wrong!', error);
        });
}


function downloadAll() {
    var bar = document.getElementById('download-all-progress');
    bar.setAttribute("max", lungimeBuletine);

    images = [];
    totalNumberOfDownloadPages = 0;
    download_current(next);
}


function readTextFile(file) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function () {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            return rawFile.responseText;
        }
    }
    rawFile.send(null);
}


/* returns a hierarchy of all tabs with a given name 
 * ex for "div" given as tagName: {
     component: div,
     childs: [{
         component: div,
         childs: []
     }, {
         component: div,
         childs: [{
             component: div,
             childs: []
         }]
     }]
 }
 */
function tagHierarchy(starterElement) {
    var tagType = starterElement.tagName;

    function getChilds(starterElement, tagType) {
        var childs = []

        function populateArray(item) {
            var childNodes = (Array.from(item.childNodes)).filter(function (x) {
                return !(/text/.test(x.nodeName));
            });
            childNodes.forEach(function (child) {
                if (child.tagName === tagType) {
                    childs.push({
                        component: child,
                        childs: []
                    });
                } else {
                    populateArray(child);
                }
            });
        }
        populateArray(starterElement);
        return childs;
    }

    function populateHierarchy(element, tagType) {
        var hierarchy = {
            component: element,
            childs: []
        }

        hierarchy.childs = getChilds(element, tagType);
        for (var index = 0; index < hierarchy.childs.length; index++) {
            hierarchy.childs[index] = populateHierarchy(hierarchy.childs[index].component, tagType);
        }

        return hierarchy;
    }

    return populateHierarchy(starterElement, tagType);
}