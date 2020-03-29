function generate() {
    var arr = Array.prototype.slice.call(document.getElementsByTagName('input'))
    arr.forEach(element => {
        var cor_spam = document.getElementById(element.getAttribute('name'));
        cor_spam.innerText = element.value;
    });
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