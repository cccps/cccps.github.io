var Utils = {};

Utils.average = function(arr){
	var length = arr.length;
	var sum = 0;
	for(var i = 0 ; i < length ; i++){
		sum += arr[i];
	}

	return Math.floor(sum/length);
}

Utils.rotateImageData = function(imageData,angle){
	if(!(imageData instanceof ImageData)) {
		console.warn('Utils.rotateImageData needs a instance of ImageData  for argument');
		return null;
	}
	if(angle != 90 && angle != -90 ){
		console.warn('Utils.rotateImageData currently only support rotating 90° or -90°');
		return null;
	}
	var canvas = document.createElement('canvas');
	var ct = canvas.getContext('2d');
	canvas.width = imageData.height;
	canvas.height = imageData.width;

	var temCanvas = Utils.imageDataToCanvas(imageData);

	ct.rotate( Math.PI*angle/180 );
	if(angle == 90){
		ct.translate(0,-canvas.width)
	}else if(angle == -90){
		ct.translate(-canvas.height,0);
	}

	ct.drawImage(temCanvas,0,0,temCanvas.width,temCanvas.height);

	var result = ct.getImageData(0,0,canvas.width,canvas.height);
	return result;
}

Utils.deepClone = function(obj){
	var str, newobj = obj.constructor === Array ? [] : {};
    if(typeof obj !== 'object'){
        return;
    }else if(obj instanceof ImageData){
    	newobj = new ImageData(obj.data.slice(0), obj.width,obj.height);
    } 
    else {
        for(var i in obj){
            newobj[i] = (typeof obj[i] === 'object' && !!obj[i]) ? 
            Utils.deepClone(obj[i]) : obj[i]; 
        }
    }
    return newobj;
}

Utils.imageToImageData = function(image){
	if(!(image instanceof Image)) {
		console.warn('Utils.imageToImageData needs a instance of Image  for argument');
		return null;
	}
	var canvas = document.createElement('canvas');
	var ct = canvas.getContext('2d');
	canvas.width = image.width;
	canvas.height = image.height;
	ct.drawImage(image,0,0,image.width,image.height);
	var imageData = ct.getImageData(0,0,image.width,image.height);
	return imageData;
}

Utils.imageDataToCanvas = function(imageData){
	if(!(imageData instanceof ImageData)) {
		console.warn('Utils.imageDataToCanvas needs a instance of ImageData  for argument');
		return null;
	}
	var canvas = document.createElement('canvas');
    var ct = canvas.getContext('2d'); 
    canvas.width = imageData.width;
    canvas.height = imageData.height;
    ct.putImageData(imageData,0,0);
    return canvas;
}

Utils.arrayToRgbString = function(arr){
	if(arr.length != 3) {
		console.warn('Utils.arrayToRgbString needs a instance of Array which\'s length = 3 for argument');
		return null;
	}
	var s = arr.join(',');
	return 'rgb('+s+')';
}

module.exports = Utils;