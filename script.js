(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------- terminal boot typing ---------------- */
  /* BUILD:bootlines */
  var bootLines = [
    { type: "prompt", text: "$ whoami" },
    { type: "out", text: "akshay patel — director of analytics, data, bi & ai" },
    { type: "gap" },
    { type: "prompt", text: "$ status" },
    { type: "out", text: "available   : immediately" },
    { type: "out", text: "based_in    : bengaluru, india" },
    { type: "out", text: "open_to     : roles in blr, pune, uae & europe" },
    { type: "gap" },
    { type: "prompt", text: "$ cat mission.txt" },
    { type: "out", text: "build data platforms and ai systems that help\nbusinesses decide faster." },
  ];
  /* /BUILD:bootlines */

  var body = document.getElementById("terminalBody");

  function renderStatic() {
    var html = "";
    bootLines.forEach(function (l) {
      if (l.type === "gap") { html += "\n"; return; }
      var cls = l.type === "prompt" ? "prompt" : "out";
      html += '<span class="' + cls + '">' + l.text + "</span>\n";
    });
    body.innerHTML = html;
  }

  function typeLines() {
    body.innerHTML = "";
    var flat = [];
    bootLines.forEach(function (l) {
      if (l.type === "gap") { flat.push({ type: "gap" }); return; }
      flat.push(l);
    });

    var li = 0;

    function nextLine() {
      if (li >= flat.length) {
        var cursor = document.createElement("span");
        cursor.className = "cursor";
        body.appendChild(cursor);
        return;
      }
      var line = flat[li++];
      if (line.type === "gap") {
        body.appendChild(document.createTextNode("\n"));
        nextLine();
        return;
      }
      var span = document.createElement("span");
      span.className = line.type === "prompt" ? "prompt" : "out";
      body.appendChild(span);
      body.appendChild(document.createTextNode("\n"));

      var chars = line.text.split("");
      var ci = 0;
      var speed = line.type === "prompt" ? 28 : 8;

      function typeChar() {
        if (ci < chars.length) {
          span.textContent += chars[ci++];
          setTimeout(typeChar, speed);
        } else {
          setTimeout(nextLine, line.type === "prompt" ? 120 : 60);
        }
      }
      typeChar();
    }
    nextLine();
  }

  if (body) {
    if (reduceMotion) {
      renderStatic();
    } else {
      typeLines();
    }
  }

  /* ---------------- pipeline nav: active section + fill ---------------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".pipeline__nodes a"));
  var mobileLinks = Array.prototype.slice.call(document.querySelectorAll(".mobilebar a"));
  var sections = navLinks.map(function (a) {
    return document.getElementById(a.getAttribute("data-target"));
  }).filter(Boolean);

  var pipelineFill = document.getElementById("pipelineFill");

  function setActive(id) {
    navLinks.forEach(function (a) {
      a.classList.toggle("active", a.getAttribute("data-target") === id);
    });
    mobileLinks.forEach(function (a) {
      a.classList.toggle("active", a.getAttribute("data-target") === id);
    });
    if (pipelineFill) {
      var idx = sections.findIndex(function (s) { return s.id === id; });
      if (idx >= 0) {
        var pct = sections.length <= 1 ? 100 : (idx / (sections.length - 1)) * 100;
        pipelineFill.style.height = pct + "%";
      }
    }
  }

  if ("IntersectionObserver" in window && sections.length) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach(function (s) { observer.observe(s); });
  }

  /* ---------------- KPI count-up ---------------- */
  var kpis = Array.prototype.slice.call(document.querySelectorAll(".kpi__num"));

  function animateCount(el) {
    var target = parseFloat(el.getAttribute("data-num"), 10);
    var prefix = el.getAttribute("data-prefix") || "";
    var suffix = el.getAttribute("data-suffix") || "";
    if (reduceMotion) {
      el.textContent = prefix + target + suffix;
      return;
    }
    var duration = 900;
    var start = null;

    function step(ts) {
      if (start === null) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var val = Math.round(target * eased);
      el.textContent = prefix + val + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  if ("IntersectionObserver" in window && kpis.length) {
    var kpiObserver = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    kpis.forEach(function (k) { kpiObserver.observe(k); });
  } else {
    kpis.forEach(animateCount);
  }

})();
