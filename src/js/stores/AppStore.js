var AppDispatcher = window.AppDispatcher;
var EventEmitter = require('events').EventEmitter;
// var assign = require('object-assign');
// var Promise = require('es6-promise').Promise;

var Constants = require('../constants');
var Config = require('../config');
var Utils = require('../utils');

//文件数据
var _files = [

];
//配置
var _conf = {
	'color' : Config.Color,
	'tool' : Config.Tool
};
//历史操作
var _prev = {};
var _next = {};

Config.AsideTools.fn.forEach(function(fn){
	fn.options.forEach(function(option){
		if(option.type == 'checkbox'){
			_conf[option.conf_name] = option.checked;
		}else if(option.type == 'select'){
			_conf[option.conf_name] = option.value;
		}
	})
})


var fileID = 0 , layerID = 0;
var activeFileID = null;

/*base*/
var AppStore = new EventEmitter();
AppStore.setMaxListeners(1000);

AppStore.emitChange = function(actionName){
	this.emit(actionName);
}

AppStore.addChangeListener = function(actionName,callback){
	this.on(actionName,callback);
}

AppStore.removeListener = function(actionName,callback) {
    this.removeListener(actionName, callback);
}
AppStore.dispatcherIndex = AppDispatcher.register(function(payload){
	var action = payload.action;
	var promise = new Promise(function(resolve,reject){
		switch(action.name){
			case Constants.AT_ALERT :
				resolve(AppStore.alert(action.data.content));
				break;
			case Constants.AT_DATA_FILE_NEW :
				resolve(AppStore.addNewFile(action.data));
				break;
			case Constants.AT_DATA_FILE_SELECT :
				resolve( AppStore.addSelectFile(action.data) );
				break;
			case Constants.AT_DATA_FILE_SELECT_ADD :
				resolve( AppStore.addSelectFileCurrent(action.data) );
				break;
			case Constants.AT_DATA_FILE_SAVE :
				resolve( AppStore.saveFile() );
				break;
			case Constants.AT_DATA_FILE_ACTIVE :
				resolve( AppStore.fileActive(action.data.file_id) );
				break;
			case Constants.AT_DATA_FILE_CLOSE:
				resolve( AppStore.fileClose(action.data.file_id) );
				break;
			case Constants.AT_DATA_FILE_INFO:
				resolve( AppStore.fileInfo(action.data) );
				break;
			case Constants.AT_DATA_FILE_EXPORT:
				resolve( AppStore.fileExport( ) );
				break;

			case Constants.AT_DATA_COLOR:
				_conf.color = action.data;
				resolve(true);
				break;
			case Constants.AT_DATA_LAYER_ACTIVE:
				resolve( AppStore.layerActive(action.data.layer_id) );
				break;
			case Constants.AT_DATA_LAYER_TOGGLE_SHOW:
				resolve( AppStore.toggleShowLayer(action.data.layer_id) );
				break;
			case Constants.AT_DATA_LAYER_RENAME:
				resolve( AppStore.layerRename(action.data.layer_id,action.data.new_name) );
				break;
			case Constants.AT_DATA_LAYER_ADD:
				resolve( AppStore.layerAdd() );
				break;
			case Constants.AT_DATA_LAYER_DEL:
				resolve( AppStore.layerDel() );
				break;
			case Constants.AT_DATA_LAYER_COPY:
				resolve( AppStore.layerCopy() );
				break;
			case Constants.AT_DATA_LAYER_UPGRADE:
				resolve( AppStore.layerWeight('upgrade') );
				break;
			case Constants.AT_DATA_LAYER_DEGRADE:
				resolve( AppStore.layerWeight('degrade') );
				break;
			case Constants.AT_DATA_LAYER_TOP:
				resolve( AppStore.layerWeight('top') );
				break;
			case Constants.AT_DATA_LAYER_BOTTOM:
				resolve( AppStore.layerWeight('bottom') );
				break;
			case Constants.AT_DATA_LAYER_LARGER:
				resolve( AppStore.layerLarger() );
				break;
			case Constants.AT_DATA_LAYER_SMALLER:
				resolve( AppStore.layerSmaller() );
				break;
			case Constants.AT_DATA_LAYER_ANTICLOCKWISE:
				resolve( AppStore.layerAnticlockwise() );
				break;
			case Constants.AT_DATA_LAYER_CLOCKWISE:
				resolve( AppStore.layerClockwise() );
				break;
			case Constants.AT_DATA_LAYER_GRAYING:
				resolve( AppStore.layerGraying() );
				break;
			case Constants.AT_DATA_LAYER_OPPOSITION:
				resolve( AppStore.layerOpposition() );
				break;
			case Constants.AT_DATA_LAYER_PIXELATE:
				resolve( AppStore.layerPixelate() );
				break;
			case Constants.AT_DATA_LAYER_BLUR:
				resolve( AppStore.layerBlur() );
				break;



			case Constants.AT_TOOL_ACTIVE:
				resolve( AppStore.toolActive(action.tool_name) );
				break;
			case Constants.AT_TOOL_MOVE:
				resolve( AppStore.toolMove(action.data) );
				break;
			case Constants.AT_TOOL_MOVE_UP:
				resolve( AppStore.toolMoveUP() );
				break;
			case Constants.AT_TOOL_CHECKBOX:
			case Constants.AT_TOOL_SELECT:
				resolve( AppStore.toolOption(action) );
				break;
			case Constants.AT_TOOL_DRAW:
			case Constants.AT_TOOL_LINE:
			case Constants.AT_TOOL_RECTANGLE:
			case Constants.AT_TOOL_ELLIPSE:
				resolve( AppStore.toolCoords(action.data) );
				break;
			case Constants.AT_TOOL_DRAW_PAINTING:
				resolve( AppStore.toolDrawPainting(action.data) );
				break;
			case Constants.AT_TOOL_DRAW_HANDLE :
				resolve( AppStore.toolDrawHandle(action.data) );
				break;
			case Constants.AT_TOOL_LINE_PAINTING:
				resolve( AppStore.drawingLine(action.data) );
				break;
			case Constants.AT_TOOL_LINE_HANDLE :
				resolve( AppStore.handleLine(action.data) );
				break;

			case Constants.AT_TOOL_RECTANGLE_PAINTING:
				resolve( AppStore.drawingRectangle(action.data) );
				break;
			case Constants.AT_TOOL_RECTANGLE_HANDLE :
				resolve( AppStore.handleRectangle(action.data) );
				break;
			case Constants.AT_TOOL_ELLIPSE_PAINTING:
				resolve( AppStore.drawingEllipse(action.data) );
				break;
			case Constants.AT_TOOL_ELLIPSE_HANDLE :
				resolve( AppStore.handleEllipse(action.data) );
				break;

			case Constants.AT_DATA_PREV :
				resolve( AppStore.prev( ) );
				break;
			case Constants.AT_DATA_NEXT :
				resolve( AppStore.next( ) );
				break;
			default:
				resolve(true);
				break;
		}
	})

	promise.then(function(value){
		if(!!value === true){
			AppStore.emitChange(action.name);
		}
	}).catch(function(error){
		console.log(error);
	})


	return true; // No errors. Needed by promise in Dispatcher.
})


/*interface*/
//获取alert内容
AppStore.getAlert = function(){
	return _conf['alert'];
}
//新建文件 默认名字
AppStore.getNewFileName = function(){
	return '未标题-'+(_files.length+1);
}
//新建图层默认名
AppStore.getNewLayerName = function(){
	var activeFile = this.getActiveFile();
	var layers = activeFile.layers;
	return '图层' + (layers.length+1);
}
//获取文件列表
AppStore.getFiles = function(){
	return _files;
}
//获取当前激活的文件
AppStore.getActiveFile = function(){
	for(var i = 0 ,len = _files.length; i < len ; i++){
		if( _files[i].id == activeFileID ){
			return _files[i];
		}
	}
	return null;
}
//获取当前激活的文件ID
AppStore.getActiveFileID = function(){
	return activeFileID;
}
//获取图层
AppStore.getLayer = function(layer_id){
	if(layer_id === undefined){
		return ;
	}
	var i,j,len_i,len_j;
	var layers;
	for(i = 0,len_i = _files.length; i < len_i; i++){
		layers = _files[i].layers;
		for(j = 0 , len_j = layers.length; j < len_j ; j++){
			if(layers[j].id == layer_id){
				return layers[j];
			}
		}
	}
	return null;
}
//图层替换
AppStore.replaceLayer = function(layer_id,layer){
	var i,j,len_i,len_j;
	var layers;
	for(i = 0,len_i = _files.length; i < len_i; i++){
		layers = _files[i].layers;
		for(j = 0 , len_j = layers.length; j < len_j ; j++){
			if(layers[j].id == layer_id && layer_id == layer.id){
				_files[i].layers[j] = layer;
				return ;
			}
		}
	}
}
//获取特定文件的激活图层
AppStore.getActiveLayer = function(file){
	var layers = file && file.layers;
	if(!file || !layers || layers.length == 0){
		return null;
	}
	for(var i = 0 ,len = layers.length; i < len ; i++){
		if(layers[i].active){
			return layers[i];
		}
	}
	return null;
}
//获取配置
AppStore.getConfig = function(config_name){
	if(config_name){
		return _conf[config_name];
	}else{
		return _conf;
	}
}
//菜单栏是否可选
AppStore.isOptional = function(action_name){
	var optinal = true;
	switch (action_name){
		case Constants.AT_FILE_SELECT_ADD:
		case Constants.AT_DATA_FILE_SAVE:
		case Constants.AT_FILE_INFO:
		case Constants.AT_DATA_LAYER_ADD:
		case Constants.AT_DATA_FILE_EXPORT:


			if(!this.getActiveFile()){
				optinal = false;
			}
			break;
		case Constants.AT_DATA_PREV : 
			if(!_prev[activeFileID] || _prev[activeFileID].length == 0){
				optinal = false;
			}
			break;
		case Constants.AT_DATA_NEXT : 
			if(!_next[activeFileID] || _next[activeFileID].length == 0){
				optinal = false;
			}
			break;
		case Constants.AT_DATA_LAYER_DEL:
		case Constants.AT_DATA_LAYER_COPY:
		case Constants.AT_DATA_LAYER_LARGER:
		case Constants.AT_DATA_LAYER_SMALLER:
		case Constants.AT_DATA_LAYER_ANTICLOCKWISE:
		case Constants.AT_DATA_LAYER_CLOCKWISE:
		case Constants.AT_DATA_LAYER_GRAYING:
		case Constants.AT_DATA_LAYER_OPPOSITION:
		case Constants.AT_DATA_LAYER_PIXELATE:
		case Constants.AT_DATA_LAYER_BLUR:

			var activeFile = this.getActiveFile();
			if(!activeFile || !AppStore.getActiveLayer(activeFile)){
				optinal = false;
			}
			break;
		case Constants.AT_DATA_LAYER_UPGRADE:
		case Constants.AT_DATA_LAYER_TOP:
			var activeFile = this.getActiveFile();
			var layers = activeFile && activeFile.layers;
			if(!activeFile || layers.length == 0 || 
				layers.indexOf(AppStore.getActiveLayer(activeFile)) == 0 ){
				optinal = false;
			}
			break;
		case Constants.AT_DATA_LAYER_DEGRADE:
		case Constants.AT_DATA_LAYER_BOTTOM:
			var activeFile = this.getActiveFile();
			var layers = activeFile && activeFile.layers;
			if(!activeFile || layers.length == 0 || 
				layers.indexOf(AppStore.getActiveLayer(activeFile)) == layers.length-1 ){
				optinal = false;
			}
			break;


		default: break;

	}
	return optinal;
}


/*数据相关*/
//新建文件
AppStore.alert = function(content){
	_conf['alert'] = content;
	return true;
}
AppStore.addNewFile = function(data){
	_files.push({
		'id' : fileID++,
		'fileName': data.name,
		'width': parseInt(data.width, 10) ,
		'height': parseInt(data.height, 10) ,
		'layers':[]
	});

	activeFileID = fileID - 1;

	return true;
}
//选择文件
AppStore.addSelectFile = function(file){
	var reader = new FileReader();
	var img = new Image();
	var promise = new Promise(function(resolve,reject){
		reader.readAsDataURL(file);
		reader.onload = function(){
			img.src = reader.result;
			img.onload = function(){
				resolve(Utils.imageToImageData(img));
			}
		}
	});

	promise.then(function(imageData){
		_files.push({
			'id' : fileID++,
			'fileName': file.name,
			'width': parseInt(img.width, 10) ,
			'height': parseInt(img.height, 10) ,
			'layers':[{
				'id':layerID++, 
				'data':imageData,
				'left':0,
				'top':0,
				'width': img.width,
				'height': img.height,
				'name':'图层1',
				'show':true,
				'active':true
			}]
		});
		activeFileID = fileID - 1;
		return true;
	}).catch(function(error){
		console.log(error);
	})
	
	return promise;
}
//在当前打开文件
AppStore.addSelectFileCurrent = function(file){
	var self = this;

	var reader = new FileReader();
	var img = new Image();
	var promise = new Promise(function(resolve,reject){
		reader.readAsDataURL(file);
		reader.onload = function(){
			img.src = reader.result;
			img.onload = function(){
				resolve(Utils.imageToImageData(img));
			}
		}
	});

	promise.then(function(imageData){
		var activeFile = self.getActiveFile();
		var layers = activeFile.layers;
		layers.unshift({
			'id':layerID++, 
			'data':imageData,
			'left':activeFile.width/2 - imageData.width/2,
			'top':activeFile.height/2 - imageData.height/2,
			'width': imageData.width,
			'height': imageData.height,
			'name':file.name.slice(0,file.name.lastIndexOf('.')),
			'show':true,
			'active':true
		})
		self.layerActive(layerID-1);
	}).catch(function(error){
		console.log(error);
	})
	
	return promise;
}
//保存文件
AppStore.saveFile = function(){
	var _saveFile = function(data, filename){
	    var save_link = document.createElement('a');
	    save_link.href = data;
	    save_link.download = filename;
	   	
	   	save_link.click();
	};
	var _fixType = function(type) {
	    type = type.toLowerCase().replace(/jpg/i, 'jpeg');
	    var r = type.match(/png|jpeg|bmp|gif/)[0];
	    return 'image/' + r;
	};

	var type = 'png';
	var imgData = paintcanvas.toDataURL('image/'+type);	
	imgData = imgData.replace(_fixType(type),'image/octet-stream');

	var filename = this.getActiveFile().fileName;
	var index = filename.lastIndexOf('.');
	if(index!=-1){
		filename = filename.slice(0,index);
	}

	_saveFile(imgData,filename+'.'+type);

	return true;
}
//文件激活
AppStore.fileActive = function(file_id){
	activeFileID = file_id;
	return true;
}
//关闭文件
AppStore.fileClose = function(file_id){
	var files = _files;
	for(var i = 0 , len = files.length; i < len ; i++){
		if(files[i].id == file_id){
			files.splice(i,1);
			break;
		}
	}
	if(files[0]){
		this.fileActive(files[0].id);
	}
	return true;
}
//修改文档信息
AppStore.fileInfo = function(data){
	for(var i = 0 , len = _files.length ;i < len; i++){
		if(_files[i].id == data.id){
			_files[i].fileName = data.name;
			_files[i].width = data.width;
			_files[i].height = data.height;
			break;
		}
	}

	return true;
}
//导出文件
AppStore.fileExport = function(){
	var link = document.createElement('a');
	var blob = new Blob([ JSON.stringify(_files) ]);
	var url = URL.createObjectURL(blob);
	link.href = url;
	link.download = '测试.cpsd';
	link.click();
}

//图层激活
AppStore.layerActive = function(layer_id){
	var layers = this.getActiveFile().layers;
	for(var i = 0 , len = layers.length; i < len ; i++){
		if(layers[i].id == layer_id){
			layers[i].active = true;
		}else{
			layers[i].active = false;
		}
	}
	return true;
}
//显示、隐藏图层
AppStore.toggleShowLayer = function(layer_id){
	var layers = this.getActiveFile().layers;
	for(var i = 0 , len = layers.length; i < len ; i++){
		if(layers[i].id == layer_id){
			layers[i].show = !layers[i].show;
			break ;
		}
	}
	return true;
}
//图层改名
AppStore.layerRename = function(layer_id,new_name){
	var layers = this.getActiveFile().layers;
	for(var i = 0 , len = layers.length; i < len ; i++){
		if(layers[i].id == layer_id){
			layers[i].name = new_name;
			break ;
		}
	}
	return true;
}
//新建图层
AppStore.layerAdd = function(){
	var activeFile = this.getActiveFile();
	if(!activeFile){
		return false;
	}
	var layers = activeFile.layers;
	layers.unshift({
		'id':layerID++, 
		'data': new ImageData(activeFile.width,activeFile.height),
		'left':0,
		'top':0,
		'width': activeFile.width,
		'height': activeFile.height,
		'name':this.getNewLayerName(),
		'show':true,
		'active':true
	})
	this.layerActive(layerID-1);
	return true;
}
//删除图层
AppStore.layerDel = function(){
	var activeFile = this.getActiveFile();
	if(!activeFile || !AppStore.getActiveLayer(activeFile)){
		return false;
	}

	var layers = activeFile.layers;
	
	for(var i = 0 , len = layers.length; i < len ; i++){
		if(layers[i].active){
			AppStore.removeHistory(layers[i].id)
			layers.splice(i,1);
			if(layers[i]){
				this.layerActive(layers[i].id);
			}else if(layers[i-1]){
				this.layerActive(layers[i-1].id);
			}
			break ;
		}
	}
	return true;
}
//复制图层
AppStore.layerCopy = function(){
 	var activeFile = this.getActiveFile();
 	var activeLayer = AppStore.getActiveLayer(activeFile);
 	if(!activeFile || !activeLayer){
 		return false;
 	}
 	var newLayer = Utils.deepClone(activeLayer);
 	newLayer.id = layerID++;

 	var layers = activeFile.layers;
 	layers.unshift(newLayer);

 	this.layerActive(layerID-1);
 	return true;
 }
 //图层顺序
AppStore.layerWeight = function(type){
 	var activeFile = this.getActiveFile();
 	var layers = activeFile && activeFile.layers;
 	if( !activeFile || layers.length == 0 ){
 		return false;
 	}
 	var activeLayer = AppStore.getActiveLayer(activeFile);
 	var targetLayer,index = layers.indexOf(activeLayer);
 	switch(type){
 		case 'upgrade':
 			if(index > 0){
 				targetLayer = layers[index-1];
 				layers[index-1] = activeLayer;
 				layers[index] = targetLayer;
 			}
 			break;
 		case 'degrade':
 			if(index < layers.length-1){
 				targetLayer = layers[index+1];
 				layers[index+1] = activeLayer;
 				layers[index] = targetLayer;
 			}
 			break;
 		case 'top':
	 		if(index > 0){
	 			targetLayer = layers[0];
	 			layers[0] = activeLayer;
 				layers[index] = targetLayer;
	 		}
 			break;
 		case 'bottom':
	 		if(index < layers.length-1){
	 			targetLayer = layers[layers.length-1];
	 			layers[layers.length-1] = activeLayer;
 				layers[index] = targetLayer;
	 		}
 		break;
 			break;

 		default:break;
 	}

 	if(!targetLayer ){
 		return false;
 	}
 	else{
 		return true;
 	}
 }
//图层放大
AppStore.layerLarger = function(){
	var activeFile = this.getActiveFile();
	var activeLayer = AppStore.getActiveLayer(activeFile);
	if(!activeFile || !activeLayer){
		return false;
	}
	var scale = 1.2;
	activeLayer.left -= parseInt(activeLayer.width * (scale-1)/2) ;
	activeLayer.top -= parseInt(activeLayer.height * (scale-1)/2) ;
	activeLayer.width += parseInt( (scale-1)*activeLayer.width ) ;
	activeLayer.height += parseInt( (scale-1)*activeLayer.height ) ;

	return true;
}
//图层缩小
AppStore.layerSmaller = function(){
	var activeFile = this.getActiveFile();
	var activeLayer = AppStore.getActiveLayer(activeFile);
	if(!activeFile || !activeLayer){
		return false;
	}
	var scale = 0.83;
	activeLayer.left += parseInt(activeLayer.width * (1-scale)/2) ;
	activeLayer.top += parseInt(activeLayer.height * (1-scale)/2) ;
	activeLayer.width -= parseInt( (1-scale)*activeLayer.width ) ;
	activeLayer.height -= parseInt( (1-scale)*activeLayer.height ) ;

	return true;
}
//图层逆时针90°
AppStore.layerAnticlockwise = function(){
	var activeFile = this.getActiveFile();
	var activeLayer = AppStore.getActiveLayer(activeFile);
	if(!activeFile || !activeLayer){
		return false;
	}
	activeLayer.data = Utils.rotateImageData(activeLayer.data,-90);

	var tem_width = activeLayer.width;
	var tem_height = activeLayer.height;

	activeLayer.left +=  (tem_width- tem_height)/2 ;
	activeLayer.top +=  (tem_height- tem_width)/2 ;

	activeLayer.width = tem_height;
	activeLayer.height = tem_width;
	return true;
}
//图层顺时针90°
AppStore.layerClockwise = function(){
	var activeFile = this.getActiveFile();
	var activeLayer = AppStore.getActiveLayer(activeFile);
	if(!activeFile || !activeLayer){
		return false;
	}
	activeLayer.data = Utils.rotateImageData(activeLayer.data,90);

	var tem_width = activeLayer.width;
	var tem_height = activeLayer.height;

	activeLayer.left +=  (tem_width- tem_height)/2 ;
	activeLayer.top +=  (tem_height- tem_width)/2 ;

	activeLayer.width = tem_height;
	activeLayer.height = tem_width;
	return true;
}
//图层灰度化
AppStore.layerGraying = function(){
	var activeFile = this.getActiveFile();
	var activeLayer = AppStore.getActiveLayer(activeFile);
	if(!activeFile || !activeLayer){
		return false;
	}

	var history = AppStore.historyFactory(activeLayer,'灰度化');
	AppStore.pushHistory(_prev,history);

	var pixels = activeLayer.data.data,
		numPixels = pixels.length / 4;
	var average;
	for(var i = 0 ; i < numPixels ; i++){
		average = ( pixels[i*4] + pixels[i*4+1] + pixels[i*4+2] ) / 3;
		pixels[i*4] = average;
		pixels[i*4+1] = average;
		pixels[i*4+2] = average;
	}

	return true;
}
//图层反相
AppStore.layerOpposition = function(){
	var activeFile = this.getActiveFile();
	var activeLayer = AppStore.getActiveLayer(activeFile);
	if(!activeFile || !activeLayer){
		return false;
	}

	var history = AppStore.historyFactory(activeLayer,'反相');
	AppStore.pushHistory(_prev,history);

	var pixels = activeLayer.data.data,
		numPixels = pixels.length / 4;
	for(var i = 0 ; i < numPixels ; i++){
		pixels[i*4] = 255 - pixels[i*4];
		pixels[i*4+1] = 255 - pixels[i*4+1];
		pixels[i*4+2] = 255 - pixels[i*4+2];
	}

	return true;
}
//图层像素化
AppStore.layerPixelate = function(){
	var activeFile = this.getActiveFile();
	var activeLayer = AppStore.getActiveLayer(activeFile);
	if(!activeFile || !activeLayer){
		return false;
	}

	var history = AppStore.historyFactory(activeLayer,'像素化');
	AppStore.pushHistory(_prev,history);

	var pixels = activeLayer.data.data,
		numPixels = pixels.length / 4;

	var blockWidth = 5;
	var w = activeLayer.data.width,
	    h = activeLayer.data.height;

	var rows = Math.ceil(w / blockWidth),
		columns = Math.ceil(h / blockWidth)

	var blockRow,blockColumn,j;

	for(var i = 0 ; i < numPixels ; i++){
		
		blockRow = Math.floor( Math.floor(i / w) / blockWidth );
		blockColumn = Math.floor( (i % w) /blockWidth );

		//优化后：取像素块中间点

		j =  Math.min( (blockRow * blockWidth) + Math.floor(blockWidth/2) ,h) * w
			+ blockColumn * blockWidth; 
		if(blockRow != rows -1 && blockColumn != columns-1){
			j +=  Math.floor(blockWidth/2);
		}

		pixels[i*4] = pixels[j*4];
		pixels[i*4+1] = pixels[j*4+1];
		pixels[i*4+2] = pixels[j*4+2];
		pixels[i*4+3] = pixels[j*4+3];
	}

	return true;
}
//图层模糊
AppStore.layerBlur = function(){
	var activeFile = this.getActiveFile();
	var activeLayer = AppStore.getActiveLayer(activeFile);
	if(!activeFile || !activeLayer){
		return false;
	}

	var history = AppStore.historyFactory(activeLayer,'像素化');
	AppStore.pushHistory(_prev,history);

	var pixels = activeLayer.data.data,
		numPixels = pixels.length / 4;
	var newImageData = Utils.deepClone(activeLayer.data),
		newPixels = newImageData.data;
	var w = activeLayer.data.width,
	    h = activeLayer.data.height;
	var r ,g ,b;
	var tem;
	for(var i = 0 ; i < numPixels ; i++){
		//边缘忽略
		if( Math.floor(i / w) == 0 || Math.floor(i / w) == h-2 || i % w == 0 || i % w == h - 1 ){
			continue;
		}
		r = [];
		g = [];
		b = [];
		tem = [ i-w-1,i-w,i-w+1,i-1,i+1,i+w-1,i+w,i+w+1 ];
		
		for(var k = 0,len = tem.length; k < len ; k++){
			if( pixels[ tem[k]*4+3 ] != 0){
				r.push( pixels[ tem[k]*4 ] );
				g.push( pixels[ tem[k]*4+1 ] );
				b.push( pixels[ tem[k]*4+2 ] );
			}
		}
		if(r.length == 0){
			continue;
		}

		newPixels[i*4] = Utils.average(r);
		newPixels[i*4+1] = Utils.average(g);
		newPixels[i*4+2] = Utils.average(b);
	}
	activeLayer.data = newImageData;

	return true;
}

//工具切换
AppStore.toolActive = function(tool_name){
	_conf.tool = tool_name;
	return true;
}
//移动工具
AppStore.toolMove = function(data){
	var startX = data.startX,
		startY = data.startY,
		deltaX = data.deltaX,
		deltaY = data.deltaY;
	var layers = this.getActiveFile().layers;
	if(layers.length == 0){
		AppStore.alert('当前没有图层可以操作');
		AppStore.emitChange(Constants.AT_ALERT);
		return false;
	}
	else{
		var layer = _conf.movingLayer;
		if( !layer ){
			if( !_conf['auto_select'] ){
				for(var i = 0, len = layers.length ;i < len; i++ ){
					if( layers[i].active ){
						layer = layers[i];
						break;
					}
				}
			}else{
				for(var i = 0, len = layers.length ;i < len; i++ ){
					if( layers[i].show && startX >= layers[i].left && startX <= layers[i].left + layers[i].width
						&& startY >= layers[i].top && startY <= layers[i].top + layers[i].height
						){
						layer = layers[i];
						AppStore.layerActive(layer.id);
						break;
					}
				}
			}
			_conf.movingLayer = layer;
		}
		
		layer.left += parseInt(deltaX) ;
		layer.top += parseInt(deltaY) ;
		return true;
	}
}
//选择图层 鼠标mouseup
AppStore.toolMoveUP = function(){
	_conf.movingLayer = null;
	return true;
}
//记录坐标(Stratrgy触发)
AppStore.toolCoords = function(data){
	var file = AppStore.getActiveFile();
	var layer = AppStore.getActiveLayer( file );
	
	if(!layer){
		AppStore.alert('当前没有图层可以操作');
		AppStore.emitChange(Constants.AT_ALERT);
		return false;
	}else{
		_conf.x = parseInt(data.x);	
		_conf.y = parseInt(data.y);	
		return true;
	}
}
//图画(ActiveLayerCanvas触发)
AppStore.toolDrawPainting = function(data){
	var layer = AppStore.getLayer( data.layer_id );

	if(!_conf.srcHandlingLayer){
		_conf.srcHandlingLayer = Utils.deepClone(layer);
	}

	layer.data = data.image_data;

	return true;
}
//画完一笔：处理
AppStore.toolDrawHandle = function(data){
	var layer = _conf.srcHandlingLayer;
	var description ;
	if(_conf.tool == 'pencil'){
		description = '画笔工具';
	}else if(_conf.tool == 'rubber'){
		description = '橡皮擦';
	}
	var history = AppStore.historyFactory(layer,description);
	AppStore.pushHistory(_prev,history);
	layer.data = data.image_data;

	_conf.srcHandlingLayer = null;

	return true;
}
//画线
AppStore.drawingLine = function(data){
	var layer = AppStore.getLayer( data.layer_id );

	if(!_conf.srcHandlingLayer){
		_conf.srcHandlingLayer = Utils.deepClone(layer);
	}

	layer.data = data.image_data;

	return true;
}
//画完线 ：处理
AppStore.handleLine = function(data){
	var layer = _conf.srcHandlingLayer;
	var description = '直线工具';

	var history = AppStore.historyFactory(layer,description);
	AppStore.pushHistory(_prev,history);
	layer.data = data.image_data;

	_conf.srcHandlingLayer = null;

	return true;
}
//画矩形
AppStore.drawingRectangle = function(data){
	var layer = AppStore.getLayer( data.layer_id );

	if(!_conf.srcHandlingLayer){
		_conf.srcHandlingLayer = Utils.deepClone(layer);
	}

	layer.data = data.image_data;

	return true;
}
//画完矩形
AppStore.handleRectangle = function(data){
	var layer = _conf.srcHandlingLayer;
	var description = '矩形工具';

	var history = AppStore.historyFactory(layer,description);
	AppStore.pushHistory(_prev,history);
	layer.data = data.image_data;

	_conf.srcHandlingLayer = null;

	return true;
}
//画椭圆
AppStore.drawingEllipse = function(data){
	var layer = AppStore.getLayer( data.layer_id );

	if(!_conf.srcHandlingLayer){
		_conf.srcHandlingLayer = Utils.deepClone(layer);
	}

	layer.data = data.image_data;

	return true;
}
//画完椭圆
AppStore.handleEllipse = function(data){
	var layer = _conf.srcHandlingLayer;
	var description = '椭圆工具';

	var history = AppStore.historyFactory(layer,description);
	AppStore.pushHistory(_prev,history);
	layer.data = data.image_data;

	_conf.srcHandlingLayer = null;

	return true;
}


//后退一步
AppStore.prev = function(){
	var history = _prev[activeFileID].pop();
	var src_layer = history.src_layer;
	var current_layer = AppStore.getLayer(src_layer.id);
	var nextHistory = AppStore.historyFactory(current_layer,history.description);
	AppStore.pushHistory(_next,nextHistory);
	AppStore.replaceLayer(src_layer.id,src_layer);
	return true;
}
//前进一步
AppStore.next = function(){
	var history = _next[activeFileID].pop();
	var src_layer = history.src_layer;
	var current_layer = AppStore.getLayer(src_layer.id);
	var prevHistory = AppStore.historyFactory(current_layer,history.description);
	AppStore.pushHistory(_prev,prevHistory,true);
	AppStore.replaceLayer(src_layer.id,src_layer);
	return true;
}

//工具选项
AppStore.toolOption = function(action){
	if(action.name == Constants.AT_TOOL_CHECKBOX){
		_conf[action.data.conf_name] = action.data.checked;
	}else if(action.name == Constants.AT_TOOL_SELECT){
		if(action.data.select_type == 'number'){
			action.data.value = parseInt(action.data.value);
		}
		_conf[action.data.conf_name] = action.data.value;
	}
	return true;
}

/*
	其他
*/
AppStore.historyFactory = function(src_layer  ,description){
	var history = {
		'src_layer' : src_layer,
		'description' : description
	};

	return Utils.deepClone(history);
}
AppStore.pushHistory = function(stack, history,preserveHistory){
	if(stack == _prev && !preserveHistory){
		delete _next[activeFileID];
	}
	if(!stack[activeFileID]){
		stack[activeFileID] = [];
	}
	stack[activeFileID].push( history );
	if(stack[activeFileID].length > Constants.HISTORY_MAX){
		stack[activeFileID].shift();
	}
}
AppStore.removeHistory = function(layer_id){
	var key;
	for (key in _prev) {
		_prev[key] = _prev[key].filter(function(history){
			if(history.src_layer.id == layer_id){
				return false;
			}
			return true;
		})
	}
	for (key in _next) {
		_next[key] = _next[key].filter(function(history){
			if(history.src_layer.id == layer_id){
				return false;
			}
			return true;
		})
	}
}

module.exports = AppStore;
window._files = _files;
window._conf = _conf;
window._prev = _prev;
window._next = _next;
window.Utils = Utils;