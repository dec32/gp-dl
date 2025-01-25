$("head").append('<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>');

function download() {
  let title = $("title").text().split("|")[1].toString().trim()
  let pageCount = $("div.page").length
  let canvases = []
  $("div.page").each((index, page) => {
    let count = index + 1
    console.debug("绘制页面...(" + count + "/" + pageCount + ")")
    canvases.push(drawPage(page))
  })

  const { jsPDF } = window.jspdf;
  let pdf = new jsPDF('p','px',[canvases[0].width, canvases[1].height])
  for (let [index, canvas] of canvases.entries()) {
    let count = index + 1
    console.debug("生成 PDF...(" + count + "/" + pageCount + ")")
    pdf.addImage(canvas.toDataURL('image/jpeg'), 'jpeg', 0, 0, canvas.width, canvas.height, '', 'MEDDIUM');
    pdf.addPage();
  }

  let targetPage = pdf.internal.getNumberOfPages();
  pdf.deletePage(targetPage);
  console.debug("保存中...")
  pdf.save(title + ".pdf");
}

function drawPage(page) {
  let pageWidth = truncatePx($(page).css("width"))
  let pageHeight = truncatePx($(page).css("height"))

  let columns = 1;
  let rows = 1;
  $(page).children("span").each(function(i, span) {
    let columnIndex = parseInt($(span).attr("class").split('-')[1])
    let rowIndex = parseInt($(span).attr("class").split('-')[2])
    columns = Math.max(columns, columnIndex + 1)
    rows = Math.max(rows, rowIndex + 1)
  })

  let spanWidth = pageWidth / columns
  let spanHeight = pageHeight / rows

  let canvas = document.createElement("canvas")
  canvas.width = pageWidth
  canvas.height = pageHeight
  let ctx = canvas.getContext("2d")
  ctx.fillStyle = "white"
  ctx.fillRect(0, 0, pageWidth, pageHeight)
  $(page).children("span").each((index, span) => {
    drawSpan(span, spanWidth, spanHeight, ctx)
  })
  return canvas
}

function drawSpan(span, width, height, ctx) {
  let img = new Image();
  img.src = $(span).css("background-image").split('"')[1]
  let imgX = -truncatePx($(span).css("background-position-x"))
  let imgY = -truncatePx($(span).css("background-position-y"))
  let spanX = $(span).attr("class").split('-')[1] * width
  let spanY = $(span).attr("class").split('-')[2] * height
  ctx.drawImage(img, imgX, imgY, width, height, spanX, spanY, width, height)
}

function truncatePx(value) {
    return Number(value.split("px")[0].toString());
}

download()
