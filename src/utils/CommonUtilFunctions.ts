export const capitalizeFirstLetter = (value: string) => {
  return value.charAt(0).toUpperCase() + value.substring(1);
};

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
  isJPEG: boolean = false
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
    const dataURL = canvas.toDataURL(`${isJPEG ? "image/jpeg" : "image/png"}`);
    const a = document.createElement("a");
    const clickEvent = new MouseEvent("click");
    a.download = `health-view-graphical${isJPEG ? ".jpeg" : ".png"}`;
    a.href = dataURL;
    a.dispatchEvent(clickEvent);
    canvas.parentNode?.removeChild(canvas);
  };
};

export const downloadSVGAsPNG = (querySelectorString: string) => {
  downloadSVGAsImg(querySelectorString);
};

export const downloadSVGAsJPEG = (querySelectorString: string) => {
  downloadSVGAsImg(querySelectorString, true);
};
