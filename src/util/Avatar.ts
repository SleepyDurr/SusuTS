import {Image, CanvasRenderingContext2D, Canvas} from "canvas";

export default class Avatar {
    magikToBuffer(magik: any) {
        return new Promise((resolve, reject) => {
            magik.stream((err: any, stdout: any, stderr: any) => {
                if (err) { return reject(err) }
                const chunks: any = []
                stdout.on('data', (chunk: any) => { chunks.push(chunk) })
                stdout.once('end', () => { resolve(Buffer.concat(chunks)) })
                stderr.once('data', (data: any) => { reject(String(data)) })
            });
        });
    }

    centerImagePart(data: Image, maxWidth: number, maxHeight: number, widthOffset: number, heightOffset: number) {
        let { width, height } = data;
        if (width > maxWidth) {
            const ratio = maxWidth / width;
            width = maxWidth;
            height *= ratio;
        }
        if (height > maxHeight) {
            const ratio = maxHeight / height;
            height = maxHeight;
            width *= ratio;
        }
        const x = widthOffset + ((maxWidth / 2) - (width / 2));
        const y = heightOffset + ((maxHeight / 2) - (height / 2));
        return { x, y, width, height };
    }

    centerImage(base: Image, data: Image) {
        const dataRatio = data.width / data.height;
        const baseRatio = base.width / base.height;
        let { width, height } = data;
        let x = 0;
        let y = 0;
        if (baseRatio < dataRatio) {
            height = data.height;
            width = base.width * (height / base.height);
            x = (data.width - width) / 2;
            y = 0;
        } else if (baseRatio > dataRatio) {
            width = data.width;
            height = base.height * (width / base.width);
            x = 0;
            y = (data.height - height) / 2;
        }

        return { x, y, width, height };
    }

    drawImageWithTint(ctx: CanvasRenderingContext2D, image: Image, color: string, x: number, y: number, width: number, height: number) {
        const { fillStyle, globalAlpha } = ctx;
        ctx.fillStyle = color;
        ctx.drawImage(image, x, y, width, height);
        ctx.globalAlpha = 0.5;
        ctx.fillRect(x, y, width, height);
        ctx.fillStyle = fillStyle;
        ctx.globalAlpha = globalAlpha;
    }

    contrast(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) {
        const data = ctx.getImageData(x, y, width, height);
        const factor = (259 / 100) + 1;
        const intercept = 128 * (1 - factor);
        for (let i = 0; i < data.data.length; i += 4) {
            data.data[i] = (data.data[i] * factor) + intercept;
            data.data[i + 1] = (data.data[i + 1] * factor) + intercept;
            data.data[i + 2] = (data.data[i + 2] * factor) + intercept;
        }
        ctx.putImageData(data, x, y);
        return ctx;
    }

    distort(ctx: CanvasRenderingContext2D, amplitude: number, x: number, y: number, width: number, height: number, strideLevel: number = 4) {
        const data = ctx.getImageData(x, y, width, height);
        const temp = ctx.getImageData(x, y, width, height);
        const stride = width * strideLevel;
        for (let i = 0; i < width; i++) {
            for (let j = 0; j < height; j++) {
                const xs = Math.round(amplitude * Math.sin(2 * Math.PI * 3 * (j / height)));
                const ys = Math.round(amplitude * Math.cos(2 * Math.PI * 3 * (i / width)));
                const dest = (j * stride) + ((i + xs) * strideLevel);
                const src = ((j + ys) * stride) + ((i + xs) * strideLevel);
                data.data[dest] = temp.data[src];
                data.data[dest + 1] = temp.data[src + 1];
                data.data[dest + 2] = temp.data[src + 2];
            }
        }
        ctx.putImageData(data, x, y);
        return ctx;
    }

    fishEye(ctx: CanvasRenderingContext2D, level: number, x: number, y: number, width: number, height: number) {
        const frame = ctx.getImageData(x, y, width, height);
        const source = new Uint8Array(frame.data);
        for (let i = 0; i < frame.data.length; i += 4) {
            const sx = (i / 4) % frame.width;
            const sy = Math.floor(i / 4 / frame.width);
            const dx = Math.floor(frame.width / 2) - sx;
            const dy = Math.floor(frame.height / 2) - sy;
            const dist = Math.sqrt((dx * dx) + (dy * dy));
            const x2 = Math.round((frame.width / 2) - (dx * Math.sin(dist / (level * Math.PI) / 2)));
            const y2 = Math.round((frame.height /2) - (dy * Math.sin(dist / (level * Math.PI) / 2)));
            const i2 = ((y2 * frame.width) + x2) * 4;
            frame.data[i] = source[i2];
            frame.data[i + 1] = source[i2 + 1];
            frame.data[i + 2] = source[i2 + 2];
            frame.data[i + 3] = source[i2 + 3];
        }
        ctx.putImageData(frame, x, y);
        return ctx;
    }

    greyscale(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) {
        const data = ctx.getImageData(x, y, width, height);
        for (let i = 0; i < data.data.length; i += 4) {
            const brightness = (0.34 * data.data[i]) + (0.5 * data.data[i + 1] + (0.16 * data.data[i + 2]));
            data.data[i] = brightness;
            data.data[i + 1] = brightness;
            data.data[i + 2] = brightness;
        }
        ctx.putImageData(data, x, y);
        return ctx;
    }

    invert(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) {
        const data = ctx.getImageData(x, y, width, height);
        for (let i = 0; i < data.data.length; i += 4) {
            data.data[i] = 255 - data.data[i];
            data.data[i + 1] = 255 - data.data[i + 1];
            data.data[i + 2] = 255 - data.data[i + 2];
        }
        ctx.putImageData(data, x, y);
        return ctx;
    }

    pixelize(ctx: CanvasRenderingContext2D, canvas: Canvas, image: Image, level: number, x: number, y: number, width: number, height: number) {
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(image, x, y, width * level, height * level);
        ctx.drawImage(canvas, x, y, width * level, height * level, x, y, width, height);
        ctx.imageSmoothingEnabled = true;
        return ctx;
    }

    sepia(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) {
        const data = ctx.getImageData(x, y, width, height);
        for (let i = 0; i < data.data.length; i += 4) {
            const brightness = (0.34 * data.data[i]) + (0.5 * data.data[i + 1]) + (0.16 * data.data[i + 2]);
            data.data[i] = brightness + 100;
            data.data[i + 1] = brightness + 50;
            data.data[i + 2] = brightness;
        }
        ctx.putImageData(data, x, y);
        return ctx;
    }
}