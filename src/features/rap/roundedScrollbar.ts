import { css } from "@emotion/react/macro";

// Source https://gist.github.com/fathyar/b65080597e7563eac56e57983d6f1a53

export default css`
  ::-webkit-scrollbar {
    width: 16px;
    height: 16px;
  }

  ::-webkit-scrollbar-thumb {
    opacity: 0.15;
    background: #80808066;
    background-clip: content-box;
    border: 3.6px solid transparent;
    /*
    I wasn't satisfied with the roundedness of the scrollbars ends
    because they look a little bit blurry. I guess it has to do with
    the way they're rendered (aliasing kind of thing).
    So, to get sharper looking of the round ends of the scrollbars
    I did some experiments with different values of the border width.
    
    It turned out that with 0.225em (3.6px) border width, the rounded ends
    look sharper than that with 4px border width.
    
        0.225em = 3.6px
        
        --> from: 16px as a base of 1em
        --> then we do the math to get the px
        --> 16px * 0.225em = 3.6px
    
    My goal here is to find just enough gap between the scrollbar thumb
    and the outer side of the scrollbar track---not too narrow that it's
    going to make the scrollbar thumb appears to be so bold and large
    which is not really appealing to my eyes and not too wide that makes
    the scrollbar thumb appears too small or narrow compared with the wide
    gap between it and the outer of the scrollbar track---without losing
    the edge definition and sharpness of the rounded ends of the scrollbar
    thumb.
    But 3.6px doesn't seem to work when it's applied on <select> tag.
    Hence I keep applying 4px for <select> tag.
    */
    border-radius: 8px;
    -webkit-box-shadow: none;
    box-shadow: none;
    min-height: 24px;
    min-width: 24px;
  }

  ::-webkit-scrollbar-thumb:hover,
  ::-webkit-scrollbar-thumb:active {
    background: #808080;
    background-clip: content-box;
    border: 3.6px solid transparent;
  }

  ::-webkit-scrollbar-track {
    background: transparent;
    border: none;
    border-radius: 8px;
  }

  ::-webkit-scrollbar-track:hover {
    background: rgba(128, 128, 128, 0.15);
  }

  ::-webkit-scrollbar-track:vertical:hover {
    border-left: 1px solid rgba(0, 0, 0, 0.1);
  }

  ::-webkit-scrollbar-track:horizontal:hover {
    border-top: 1px solid rgba(0, 0, 0, 0.1);
  }

  select::-webkit-scrollbar-thumb {
    border: 4px solid hsl(0 0% 92% / 1);
  }

  select::-webkit-scrollbar-track {
    background: hsl(0 0% 92% / 1);
  }

  select::-webkit-scrollbar-track:vertical,
  select::-webkit-scrollbar-track:horizontal {
    border-top: none;
    border-left: none;
  }
`;
