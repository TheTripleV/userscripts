// ==UserScript==
// @name        FRC Docs Github
// @namespace   TheTripleV
// @match       https://github.com/wpilibsuite/frc-docs/*
// @grant       none
// @version     1.0
// @author      TheTripleV
// @description Better frc-docs github
// 
// ==/UserScript==

function htmlToElement(html) {
  let d = document.createElement('div');
  d.innerHTML = html.trim();
  return d.firstChild;
}

const starPaths = window.location.pathname.substring(22).split("/");
const isPull = starPaths[0] == "pull";
const isPullFiles = starPaths[2] == "files";
const pullNumber = starPaths[1];
const rtdBuildURL = `https://frc-docs--${pullNumber}.org.readthedocs.build/en/${pullNumber}/`;
const rtdLatestURL = `https://docs.wpilib.org/en/latest/`;

if (isPull) {
  const text = "RTD Build";
  new MutationObserver(() => {
    let editAndCodeButtons = document.querySelector("#partial-discussion-header > div.gh-header-show > div > div");

    if (editAndCodeButtons.children[0].text == text) {
      return;
    }
    
    editAndCodeButtons.innerHTML = `<a href="${rtdBuildURL}" class="btn btn-sm d-inline-block float-left float-none m-0 mr-md-0" style="margin-right:4px !important;">${text}</a>` + editAndCodeButtons.innerHTML;
  }).observe(document, {childList: true, subtree: true});
}

if (isPullFiles) {

  new MutationObserver(() => {
    
    for (const header of document.getElementsByClassName("js-replace-file-header-review")) {
      if (!header) continue;

      if (header.innerHTML.includes("RTD")) {
        continue;
      }
      
      let filename = header.querySelector('[name="path"]').value;
      // if (! (filename.split(".").pop()) == "rst") {
      //   continue;
      // }
      let path = filename.split("/").slice(1).join("/").replace(/\.rst$/, '.html');
      let filePageURL = rtdBuildURL + path;
      let latestPageURL = rtdLatestURL + path;
      let rtdEmbedButton = htmlToElement(`
        <a href="${filePageURL}" class="btn btn-sm ml-2">
          RTD
        </a>
      `);
      
      header.prepend(rtdEmbedButton);
    }
  }).observe(document, {childList: true, subtree: true});
  
}
