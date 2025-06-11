import React, { useRef, useEffect } from "react";
import "pannellum/src/js/pannellum";
import "pannellum/src/js/libpannellum";
import "pannellum/src/css/pannellum.css";

const pannellum = (window as any).pannellum;

const ExploreCamp: React.FC = props => {
    const { current: id } = useRef(
        `panorama-${Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000}`
    );
    const viewer = useRef<any>(null);

    useEffect(() => {
        viewer.current = pannellum.viewer(id, {
            autoLoad: true,
            panorama: "/images/other/850x400.jpg",
            dynamicUpdate: true,
            compass: false,
            friction: 0,
            mouseZoom: false,
            showZoomCtrl: false,
            showFullscreenCtrl: false,
            type: "equirectangular"
        });

        return () => {
            viewer.current.destroy();
        };
    }, [id]);

    return (
        <>
            <div className="h-full w-full" {...props} id={id}>
            </div>
        </>
    )
}
export default ExploreCamp