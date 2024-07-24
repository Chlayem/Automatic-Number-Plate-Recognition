
import React, { useRef, useEffect, useState } from 'react';

const Canvas = ({ imageUrl, roi, setROI }) => {
    const canvasRef = useRef(null);
    const imgRef = useRef(new Image());
    const [isDrawing, setIsDrawing] = useState(false);
    const containerRef = useRef(null);
    const [tempRoi, setTempRoi] = useState({x:0,y:0,width:0,height:0});

    
    const drawROI = (context,roiToDraw = tempRoi) => {
        context.strokeStyle = 'red';
        context.lineWidth = 2;
        context.strokeRect(roiToDraw.x, roiToDraw.y, roiToDraw.width, roiToDraw.height);
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        const container = containerRef.current;
        
        const resizeCanvas = () => {
            if (!imgRef.current.src) return;
            const ratio = imgRef.current.naturalWidth / imgRef.current.naturalHeight;
            console.log("image width:", imgRef.current.naturalWidth,"height :",imgRef.current.naturalHeight);

            const containerWidth = container.offsetWidth;
            const containerHeight = containerWidth / ratio;
            console.log("container width:", containerWidth,"height :",containerHeight);
            canvas.width = containerWidth;
            canvas.height = containerHeight;

            const scale = canvas.width / imgRef.current.naturalWidth;
            const scaledRoi = {
                x: Math.round(roi.x * scale),
                y: Math.round(roi.y * scale),
                width: Math.round(roi.width * scale),
                height: Math.round(roi.height * scale)
            };
            console.log("initial",scaledRoi);
        
            setTempRoi(scaledRoi);

            context.clearRect(0, 0, canvas.width, canvas.height);
            context.drawImage(imgRef.current, 0, 0, canvas.width, canvas.height);
            console.log(tempRoi);
            drawROI(context,scaledRoi);
        };
        
        imgRef.current.src = imageUrl;
        
        imgRef.current.onload = () => {
            resizeCanvas();
        };


       

    }, [imageUrl]);

    const startDrawing = (e) => {
        const rect = canvasRef.current.getBoundingClientRect();
        const x = Math.round(e.clientX - rect.left);
        const y = Math.round(e.clientY - rect.top);
        setTempRoi({ x, y, width : 0, height:0 });    
        setIsDrawing(true);
    };

    const draw = (e) => {
        if (!isDrawing) return;
        const rect = canvasRef.current.getBoundingClientRect();
        const x = Math.round(e.clientX - rect.left);
        const y = Math.round(e.clientY - rect.top);
        const width = x - tempRoi.x;
        const height = y - tempRoi.y;
        setTempRoi(prev => ({ ...prev, width, height }));

        const context = canvasRef.current.getContext('2d');
        context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        context.drawImage(imgRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
        drawROI(context);
    };

    const finishDrawing = () => {
        setIsDrawing(false);
        let finalRoi = {...tempRoi};
        
        if(tempRoi.width < 0){
            finalRoi.x += tempRoi.width;
            finalRoi.width = -tempRoi.width;
        }
        if(tempRoi.height < 0){
            finalRoi.y += tempRoi.height; 
            finalRoi.height = -tempRoi.height;
        }
        setTempRoi(finalRoi);
        const scale =  imgRef.current.naturalWidth/canvasRef.current.width ;
        console.log("scale:",scale);

        const scaledRoi = {
            x: Math.round(finalRoi.x * scale),
            y: Math.round(finalRoi.y * scale),
            width: Math.round(finalRoi.width * scale),
            height: Math.round(finalRoi.height * scale)
        };
        console.log(scaledRoi);
        setROI(scaledRoi);
    };

    return (
        <div ref={containerRef} className="image-wrapper" style={{ width: '100%' }}>
            <canvas
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={finishDrawing}
                onMouseLeave={finishDrawing}
            />
        </div>
    );
};

export default Canvas;
