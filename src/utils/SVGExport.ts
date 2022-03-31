import { jsPDF } from "jspdf";

export const downloadSVGAsText = (querySelectorString: string = "svg") => {
  const svg = document.querySelector(querySelectorString)!;
  const base64doc = btoa(unescape(encodeURIComponent(svg.outerHTML)));
  const a = document.createElement("a");
  const clickEvent = new MouseEvent("click");
  a.download = "health-view-graphical.svg";
  a.href = "data:image/svg+xml;base64," + base64doc;
  a.dispatchEvent(clickEvent);
};

const downloadSVGAsImg = (
  querySelectorString: string = "svg",
  isPNG: boolean = false,
  isPDF: boolean = false
) => {
  const canvas = document.createElement("canvas");
  const svg = document.querySelector(querySelectorString)!;
  const base64doc = btoa(unescape(encodeURIComponent(svg.outerHTML)));
  const w = svg.getAttribute("width")!;
  const h = svg.getAttribute("height")!;
  const imgToDownload = document.createElement("img");
  imgToDownload.src = "data:image/svg+xml;base64," + base64doc;
  imgToDownload.onload = () => {
    canvas.setAttribute("width", w);
    canvas.setAttribute("height", h);
    const context = canvas.getContext("2d")!;
    context.drawImage(imgToDownload, 0, 0, +w, +h);
    const dataURL = canvas.toDataURL(`${isPNG ? "image/png" : "image/jpeg"}`);

    if (isPDF) {
      const doc = new jsPDF({
        orientation: "l",
        unit: "mm",
        format: "a4",
      });
      const imgProps = doc.getImageProperties(dataURL);
      const pdfWidth = doc.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      doc.addImage(dataURL, "PNG", 2, 2, pdfWidth, pdfHeight);
      doc.save("Health-View-Graphical.pdf");
    } else {
      const a = document.createElement("a");
      const clickEvent = new MouseEvent("click");
      a.download = `Health-View-Graphical${isPNG ? ".png" : ".jpeg"}`;
      a.href = dataURL;
      a.dispatchEvent(clickEvent);
      canvas.parentNode?.removeChild(canvas);
    }
  };
};

export const downloadSVGAsJPEG = (querySelectorString: string) => {
  downloadSVGAsImg(querySelectorString);
};

export const downloadSVGAsPNG = (querySelectorString: string) => {
  downloadSVGAsImg(querySelectorString, true);
};

export const downloadSVGAsPDF = (querySelectorString: string = "svg") => {
  downloadSVGAsImg(querySelectorString, true, true);
};
