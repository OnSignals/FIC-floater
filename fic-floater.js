class FICFloater {
  constructor() {
    const html = String.raw;
    const css = String.raw;

    this.template = html`
      <aside data-ficfloater-role="position">
        <a href="{{url}}" title="{{title}}" data-ficfloater-role="wrapper">
          <h4 data-ficfloater-role="title">{{title}}</h4>
        </a>

        <button title="Hide" data-ficfloater-role="hide">Hide</button>
      </aside>
    `;

    this.styles = css`
      @keyframes ficfloater-wiggle {
        0% {
          transform: rotate(-10deg);
        }

        2.5% {
          transform: rotate(7deg);
        }

        5% {
          transform: rotate(-5deg);
        }

        7.5% {
          transform: rotate(5deg);
        }

        10% {
          transform: rotate(0deg);
        }
      }

      [data-ficfloater-role="position"] {
        --logo-width: 100px;
        --logo-height: 100px;
        --logo-margin-v: 40px;
        --logo-margin-h: 40px;

        --logo-src: url("https://cdn.shopify.com/s/files/1/1688/7473/files/FC_Musi-Spezi.svg?v=1777544853");

        position: fixed;
        left: 0;
        bottom: 0;

        margin: 0 var(--logo-margin-h) var(--logo-margin-v);

        transform: translateY(
          calc(var(--logo-margin-v) + 20px + var(--logo-height))
        );

        transition-property: transform;
        transition-duration: 500ms;
        transition-timing-function: cubic-bezier(0.32, -0.01, 0.6, -0.61);

        &.isVisible {
          transform: translateY(0);

          transition-duration: 800ms;
          transition-timing-function: cubic-bezier(0.27, 1.54, 0.61, 1.02);
        }
      }

      [data-ficfloater-role="wrapper"] {
        display: block;
        width: var(--logo-width);
        height: var(--logo-height);

        background-repeat: no-repeat;
        background-position: center center;
        background-size: contain;
        background-image: var(--logo-src);

        animation: ficfloater-wiggle infinite 5000ms 2000ms linear;
      }

      [data-ficfloater-role="title"]:not(:focus):not(:active) {
        position: absolute;
        width: 1px;
        height: 1px;
        overflow: hidden;
        clip: rect(0 0 0 0);
        clip-path: inset(50%);
        white-space: nowrap;
      }

      [data-ficfloater-role="hide"] {
        position: absolute;
        right: 0;
        top: 0;
        z-index: 10;

        appearance: none;

        display: block;
        width: 20px;
        height: 20px;
        margin: -10px;
        padding: 0;
        overflow: hidden;
        white-space: nowrap;
        text-indent: 300%;

        background: white;
        border: none;
        border-radius: 50%;

        cursor: pointer;

        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);

        &::before,
        &::after {
          content: " ";

          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;

          display: block;
          height: 1px;
          margin: auto 30%;

          background-color: black;
        }

        &::before {
          transform: rotate(-45deg);
        }

        &::after {
          transform: rotate(45deg);
        }
      }

      @media (max-width: 720px) {
        [data-ficfloater-role="position"] {
          --logo-width: 90px;
          --logo-height: 90px;
          --logo-margin-v: 20px;
          --logo-margin-h: 20px;
        }
      }
    `;

    this.pathEnableList = ['/'];

    this.url = "https://open.spotify.com/playlist/5ElZjsvy8E0OWrutuQouvT?si=cb178e9208cf4edf";
    this.title = "title...";

    this.initialDelay = 1000;
    this.scrollThreshold = 200;

    this.element;

    this.viewportWidth = 0;
    this.viewportHeight = 0;

    this.isEnabled = false;
    this.isVisible = false;
    this.isManuallyHidden = false;
    // this.isActive = false;

    if (this.pathEnableList.includes(location.pathname)) {
      this.isEnabled = true;
      this.init();
    }
  }

  build() {
    // element
    const element = document.createElement("div");
    element.innerHTML = this.template
      .replace(/{{title}}/gi, this.title)
      .replace(/{{url}}/gi, this.url)
      .trim();

    this.element = element.firstChild;

    document.body.append(this.element);

    // CSS
    const style = document.createElement("style");
    style.textContent = this.styles;
    document.head.appendChild(style);
  }

  unbuild() {
    if (!this.element) return;

    this.element.remove();
    this.element = null;
  }

  show() {
    if (!this.element) return;
    if (this.isVisible) return;

    this.isVisible = true;

    this.element.classList.add("isVisible");
  }

  hide() {
    if (!this.element) return;
    if (!this.isVisible) return;

    this.isVisible = false;

    this.element.classList.remove("isVisible");
  }

  init() {
    console.log("FCFloater.init()");

    this.build();
    this.bindEvents();
    this.onResize();

    setTimeout(() => {
      this.show();
    }, this.initialDelay);
  }

  destroy() {
    this.unbindEvents();
    this.unbuild();
  }

  bindEvents() {
    this.onResize = this.onResize.bind(this);
    this.onScroll = this.onScroll.bind(this);
    this.onClick = this.onClick.bind(this);

    window.addEventListener("resize", this.onResize);
    window.addEventListener("scroll", this.onScroll, { passive: true });

    if (this.element) {
      this.element.addEventListener("click", this.onClick);
    }
  }

  unbindEvents() {
    window.removeEventListener("resize", this.onResize);
    window.removeEventListener("scroll", this.onScroll, { passive: true });

    if (this.element) {
      this.element.addEventListener("click", this.onClick);
    }
  }

  onResize() {
    this.viewportWidth = window.innerWidth;
    this.viewportHeight = window.innerHeight;
  }

  onScroll() {
    console.log(document.scrollingElement.scrollTop);
    if (
      document.scrollingElement.scrollTop >= this.scrollThreshold &&
      this.isVisible
    ) {
      this.hide();
    } else if (
      document.scrollingElement.scrollTop < this.scrollThreshold &&
      !this.isVisible &&
      !this.isManuallyHidden
    ) {
      this.show();
    }
  }

  onClick(event) {
    if (event.target.matches("button")) {
      this.isManuallyHidden = true;
      this.hide();
    }
  }
}

new FICFloater();
