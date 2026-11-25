/* Display URLs for the R2 catalog.
   Masters stay on the original URL (what "Open file" saves).
   Tiles and the lightbox ask images.weserv.nl for WebP sized to the slot.
   AVIF is disabled on that proxy; local homepage files are AVIF/WebP from
   scripts/build-display-media.py. Quality: tiles q=80, lightbox q=84,
   checked against an Odyssey still and a film PNG. */
(function (global) {
    var TILE_WIDTHS = [480, 800, 1200];
    var VIEW_WIDTHS = [960, 1440, 1920];
    var TILE_Q = 80;
    var VIEW_Q = 84;

    function pathOf(url) {
        return String(url || "").split("#")[0].split("?")[0];
    }

    function isRaster(url) {
        return /\.(jpe?g|png|gif|webp|avif)$/i.test(pathOf(url));
    }

    function isRemote(url) {
        return /^https?:/i.test(url);
    }

    function proxy(url, opts) {
        var params = new URLSearchParams();
        params.set("url", url);
        params.set("w", String(opts.w));
        params.set("output", "webp");
        params.set("q", String(opts.q));
        params.set("we", "1");
        if (opts.blur) params.set("blur", String(opts.blur));
        return "https://wsrv.nl/?" + params.toString();
    }

    function widthsFor(role) {
        return role === "view" ? VIEW_WIDTHS : TILE_WIDTHS;
    }

    function qualityFor(role) {
        return role === "view" ? VIEW_Q : TILE_Q;
    }

    function sizesFor(role) {
        if (role === "view") return "(max-width: 760px) 100vw, 1100px";
        if (role === "cover") return "(max-width: 700px) 92vw, (max-width: 1100px) 45vw, 320px";
        return "(max-width: 700px) 92vw, (max-width: 1100px) 46vw, 360px";
    }

    function srcset(url, role) {
        var q = qualityFor(role);
        return widthsFor(role).map(function (w) {
            return proxy(url, { w: w, q: q }) + " " + w + "w";
        }).join(", ");
    }

    function attrs(master, role) {
        role = role || "tile";
        if (!master || !isRaster(master) || !isRemote(master)) {
            return { src: master || "", srcset: "", sizes: "", lqip: "", master: master || "" };
        }
        var q = qualityFor(role);
        var widths = widthsFor(role);
        var mid = widths[Math.min(1, widths.length - 1)];
        return {
            src: proxy(master, { w: role === "view" ? 1440 : mid, q: q }),
            srcset: srcset(master, role),
            sizes: sizesFor(role),
            lqip: proxy(master, { w: 48, q: 40, blur: 1 }),
            master: master,
        };
    }

    function filename(url) {
        try {
            var parsed = new URL(url, global.location ? global.location.href : undefined);
            var base = parsed.pathname.split("/").pop() || "wallpaper";
            return decodeURIComponent(base);
        } catch (err) {
            return "wallpaper";
        }
    }

    function reveal(img) {
        img.classList.add("is-ready");
        img.classList.remove("is-pending");
    }

    function watch(img) {
        if (!img || img.dataset.mediaWatch) return;
        img.dataset.mediaWatch = "1";
        img.addEventListener("load", function () {
            if (img.naturalWidth) reveal(img);
        });
        img.addEventListener("error", function () {
            var master = img.dataset.master;
            if (img.dataset.fellback === "1" || !master) {
                reveal(img);
                return;
            }
            img.dataset.fellback = "1";
            img.removeAttribute("srcset");
            img.removeAttribute("sizes");
            img.src = master;
        });
        if (img.complete && img.naturalWidth) reveal(img);
    }

    function paintFrame(img) {
        var frame = img.closest(".gallery-item, .collection-preview, .modal-stage");
        if (!frame || !img.dataset.lqip) return;
        frame.style.backgroundImage = 'url("' + img.dataset.lqip.replace(/"/g, "") + '")';
        frame.style.backgroundSize = frame.classList.contains("modal-stage") ? "contain" : "cover";
        frame.style.backgroundRepeat = "no-repeat";
        frame.style.backgroundPosition = "center";
    }

    function hydrate(root) {
        if (!root) return;
        root.querySelectorAll("img[data-master]").forEach(function (img) {
            paintFrame(img);
            watch(img);
        });
    }

    function prefetch(master, role) {
        var built = attrs(master, role || "view");
        if (!built.src || built.src === master) return;
        var image = new Image();
        if (built.srcset) {
            image.srcset = built.srcset;
            image.sizes = built.sizes;
        }
        image.src = built.src;
    }

    global.BetterMedia = {
        attrs: attrs,
        filename: filename,
        hydrate: hydrate,
        prefetch: prefetch,
        watch: watch,
        isRaster: isRaster,
    };
}(window));
