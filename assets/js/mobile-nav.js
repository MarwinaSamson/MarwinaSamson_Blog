/**
 * mobile-nav.js — Industry Visit Storybook
 *
 * On mobile (≤768px), the nav bar is hidden and the reader
 * scrolls continuously through the storybook.
 *
 * FORWARD  — scroll to the very bottom → animated ↓ chevron
 *             appears, then auto-navigates to the NEXT page.
 *
 * BACKWARD — scroll back to the very top → animated ↑ chevron
 *             appears. Tap it, or keep pulling up (touch
 *             overscroll gesture), to go to the PREVIOUS page.
 *
 * Add to the bottom of every spread HTML page (before </body>):
 *   <script src="assets/js/mobile-nav.js"></script>
 */

(function () {
  'use strict';

  /* Only run on mobile viewports */
  if (window.innerWidth > 768) return;

  /* ── Read prev / next URLs from nav buttons ── */
  var navBtns = document.querySelectorAll('.nav-btn');
  var prevUrl = navBtns.length >= 1 ? navBtns[0].getAttribute('href') : null;
  var nextUrl = navBtns.length >= 2 ? navBtns[navBtns.length - 1].getAttribute('href') : null;

  /* Ignore empty or self-referencing hrefs */
  if (prevUrl === '#' || prevUrl === '') prevUrl = null;
  if (nextUrl === '#' || nextUrl === '') nextUrl = null;

  /* ── Shared navigate helper ── */
  var navigated = false;
  function goTo(url, el) {
    if (navigated || !url) return;
    navigated = true;
    if (el) el.classList.add('leaving');
    setTimeout(function () { window.location.href = url; }, 350);
  }


  /* ════════════════════════════════════════════════════════
     BOTTOM HINT  — forward navigation
  ════════════════════════════════════════════════════════ */

  var bottomHint = null;
  if (nextUrl) {
    bottomHint = document.createElement('div');
    bottomHint.className = 'mob-continue';
    bottomHint.setAttribute('role', 'button');
    bottomHint.setAttribute('aria-label', 'Continue to next section');
    bottomHint.innerHTML =
      '<div class="mc-caret mc-caret--down"></div>' +
      '<span class="mc-label">Continue</span>';
    document.body.appendChild(bottomHint);
    bottomHint.addEventListener('click', function () { goTo(nextUrl, bottomHint); });
  }


  /* ════════════════════════════════════════════════════════
     TOP HINT  — backward navigation
  ════════════════════════════════════════════════════════ */

  var topHint = null;
  if (prevUrl) {
    topHint = document.createElement('div');
    topHint.className = 'mob-back';
    topHint.setAttribute('role', 'button');
    topHint.setAttribute('aria-label', 'Go back to previous section');
    topHint.innerHTML =
      '<span class="mb-label">Back</span>' +
      '<div class="mb-caret"></div>';
    document.body.appendChild(topHint);
    topHint.addEventListener('click', function () { goTo(prevUrl, topHint); });
  }


  /* ════════════════════════════════════════════════════════
     SCROLL HANDLER
  ════════════════════════════════════════════════════════ */

  var SHOW_BOTTOM  = 200;  /* px from bottom — show forward hint  */
  var AUTO_BOTTOM  = 30;   /* px from bottom — auto-navigate fwd  */
  var SHOW_TOP     = 60;   /* px from top    — show back hint     */

  var bottomVisible = false;
  var topVisible    = false;
  var autoTimer     = null;

  function cancelAutoNav() {
    if (autoTimer) { clearTimeout(autoTimer); autoTimer = null; }
  }

  function scheduleAutoNav(url, el) {
    if (navigated || autoTimer) return;
    autoTimer = setTimeout(function () { goTo(url, el); }, 700);
  }

  function onScroll() {
    var scrollTop    = window.scrollY;
    var scrollBottom = scrollTop + window.innerHeight;
    var pageHeight   = document.documentElement.scrollHeight;
    var distBottom   = pageHeight - scrollBottom;
    var distTop      = scrollTop;

    /* ── Forward (bottom) hint ── */
    if (bottomHint) {
      if (distBottom <= SHOW_BOTTOM && !bottomVisible) {
        bottomVisible = true;
        bottomHint.classList.add('visible');
      }
      if (distBottom > SHOW_BOTTOM && bottomVisible) {
        bottomVisible = false;
        bottomHint.classList.remove('visible');
        bottomHint.classList.remove('active');
      }
      if (distBottom <= AUTO_BOTTOM) {
        bottomHint.classList.add('active');
        scheduleAutoNav(nextUrl, bottomHint);
      } else {
        bottomHint.classList.remove('active');
        if (distBottom > AUTO_BOTTOM) cancelAutoNav();
      }
    }

    /* ── Backward (top) hint ── */
    if (topHint) {
      if (distTop <= SHOW_TOP && !topVisible) {
        topVisible = true;
        topHint.classList.add('visible');
      }
      if (distTop > SHOW_TOP && topVisible) {
        topVisible = false;
        topHint.classList.remove('visible');
        topHint.classList.remove('active');
      }
      if (distTop === 0) {
        topHint.classList.add('active');
      } else {
        topHint.classList.remove('active');
      }
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); /* run once on load */


  /* ════════════════════════════════════════════════════════
     PULL-DOWN OVERSCROLL  — navigate back with a swipe-up
     gesture when already at the very top of the page
  ════════════════════════════════════════════════════════ */

  if (prevUrl) {
    var touchStartY  = 0;
    var touchStartX  = 0;
    var pulling      = false;
    var PULL_THRESHOLD = 72;  /* px of upward drag needed to trigger */

    document.addEventListener('touchstart', function (e) {
      touchStartY = e.touches[0].clientY;
      touchStartX = e.touches[0].clientX;
      pulling = false;
    }, { passive: true });

    document.addEventListener('touchmove', function (e) {
      if (navigated) return;
      if (window.scrollY > 10) return; /* only at the very top */

      var dy = e.touches[0].clientY - touchStartY;
      var dx = e.touches[0].clientX - touchStartX;

      /* Ignore mostly-horizontal swipes */
      if (Math.abs(dx) > Math.abs(dy)) return;

      if (dy > PULL_THRESHOLD && !pulling) {
        pulling = true;

        /* Visual feedback on the top hint */
        if (topHint) {
          topHint.classList.add('pulling');
          setTimeout(function () {
            topHint && topHint.classList.remove('pulling');
          }, 500);
        }

        goTo(prevUrl, topHint);
      }
    }, { passive: true });
  }

})();