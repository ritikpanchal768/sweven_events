// import { useEffect } from "react";

// interface InstagramEmbedProps {
//   url: string;
// }

// export function InstagramEmbed({ url }: InstagramEmbedProps) {

//   useEffect(() => {
//     // Load Instagram script if not already loaded
//     if (!(window as any).instgrm) {
//       const script = document.createElement("script");
//       script.src = "https://www.instagram.com/embed.js";
//       script.async = true;
//       document.body.appendChild(script);
//     } else {
//       (window as any).instgrm.Embeds.process();
//     }
//   }, [url]);

//   return (
//     <blockquote
//       className="instagram-media"
//       data-instgrm-permalink={url}
//       data-instgrm-version="14"
//       style={{
//         background: "#FFF",
//         borderRadius: "8px",
//         margin: "0 auto",
//         maxWidth: "540px",
//         width: "100%"
//       }}
//     />
//   );
// }

import { useEffect } from "react";

declare global {
  interface Window {
    instgrm: any;
  }
}

interface InstagramEmbedProps {
  url: string;
}

export function InstagramEmbed({ url }: InstagramEmbedProps) {

  useEffect(() => {
    const scriptId = "instagram-embed-script";

    const processEmbeds = () => {
      if (window.instgrm) {
        window.instgrm.Embeds.process();
      }
    };

    // If script not loaded → load it
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://www.instagram.com/embed.js";
      script.async = true;
      script.onload = processEmbeds;
      document.body.appendChild(script);
    } else {
      processEmbeds();
    }
  }, [url]);

  return (
    <div className="min-w-[350px] max-w-[350px] flex-shrink-0 rounded-2xl overflow-hidden shadow-xl">
      <blockquote
        className="instagram-media"
        data-instgrm-permalink={url}
        data-instgrm-version="14"
        style={{ background: "transparent" }}
      ></blockquote>
    </div>
  );
}