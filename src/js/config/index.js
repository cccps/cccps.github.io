var Constants = require('../constants');

var Config = {};												
Config.Menu = {
	'columns':[
	  {
	    'name':'文件',
	    'items':[
	    	{
	    		'name':'新建',
	    		'action_name' : Constants.AT_FILE_NEW
	    	},{
	    		'name':'打开',
	    		'action_name' : Constants.AT_FILE_SELECT
	    	},{
	    		'name':'在当前打开',
	    		'action_name' : Constants.AT_FILE_SELECT_ADD
	    	},{
	    		'name':'文档信息',
	    		'action_name' : Constants.AT_FILE_INFO
	    	},{
	    		'name':'保存图片',
	    		'action_name' : Constants.AT_DATA_FILE_SAVE
	    	}
	    	// ,{
	    	// 	'name':'导入文件',
	    	// 	'action_name' : ''
	    	// },
	    	// {
	    	// 	'name':'导出文件',
	    	// 	'action_name' : Constants.AT_DATA_FILE_EXPORT
	    	// }
	    ]
	  },{
	    'name':'编辑',
	    'items':[
	    	{
	    		'name':'后退一步',
	    		'action_name': Constants.AT_DATA_PREV
	    	},{
	    		'name':'前进一步',
	    		'action_name': Constants.AT_DATA_NEXT
	    	}
	    ]
	  },{
	    'name':'图层',
	    'items':[
	    	{
	    		'name':'新建',
	    		'action_name' : Constants.AT_DATA_LAYER_ADD
	    	},{
	    		'name':'删除',
	    		'action_name' : Constants.AT_DATA_LAYER_DEL
	    	},{
	    		'name':'复制图层',
	    		'action_name' : Constants.AT_DATA_LAYER_COPY
	    	},{
	    		'name':'前移',
	    		'action_name' : Constants.AT_DATA_LAYER_UPGRADE
	    	},{
	    		'name':'后移',
	    		'action_name' : Constants.AT_DATA_LAYER_DEGRADE
	    	},{
	    		'name':'置为顶层',
	    		'action_name' : Constants.AT_DATA_LAYER_TOP
	    	},{
	    		'name':'置为底层',
	    		'action_name' : Constants.AT_DATA_LAYER_BOTTOM
	    	},{
	    		'name':'放大',
	    		'action_name' : Constants.AT_DATA_LAYER_LARGER
	    	},{
	    		'name':'缩小',
	    		'action_name' : Constants.AT_DATA_LAYER_SMALLER
	    	},{
	    		'name':'逆时针旋转90°',
	    		'action_name' : Constants.AT_DATA_LAYER_ANTICLOCKWISE
	    	},{
	    		'name':'顺时针旋转90°',
	    		'action_name' : Constants.AT_DATA_LAYER_CLOCKWISE
	    	}
	    ]
	  },{
	    'name':'滤镜',
	    'items':[
	    	{
	    		'name':'灰度化',
	    		'action_name' : Constants.AT_DATA_LAYER_GRAYING
	    	},{
	    		'name':'反相',
	    		'action_name' : Constants.AT_DATA_LAYER_OPPOSITION
	    	},{
	    		'name':'像素化',
	    		'action_name' : Constants.AT_DATA_LAYER_PIXELATE
	    	},{
	    		'name':'模糊',
	    		'action_name' : Constants.AT_DATA_LAYER_BLUR
	    	}
	    ]
	  }
	]
};

Config.AsideTools = {
	'fn':[
		{	
			'tool':'move',
			'name' : '移动工具',
			'icon':' ./src/img/move.png',
			'items':[],
			'options':[
				{
					'name' : '自动选择',
					'type' : 'checkbox',
					'checked' : true,
					'conf_name' : 'auto_select',
					'action_name' : Constants.AT_TOOL_CHECKBOX
				}
			]
		},
		{	
			'tool':'pencil',
			'name' : '画笔工具',
			'icon':' ./src/img/pencil.png',
			'items':[],
			'options':[
				{
					'name' : '笔触大小',
					'type' : 'select',
					'select_type' : 'number',
					'value' : 5,
					'range' : [1,20],
					'conf_name' : 'pencil_size',
					'action_name' : Constants.AT_TOOL_SELECT
				},{
					'name' : '笔触末端',
					'type' : 'select',
					'select_type' : 'text',
					'value' : 'round',
					'range' : ['round','square'],
					'range_name' : ['圆形','方形'],
					'conf_name' : 'pencil_linecap',
					'action_name' : Constants.AT_TOOL_SELECT
				}
			]
		},
		{	
			'tool':'rubber',
			'name' : '橡皮擦工具',
			'icon':' ./src/img/rubber.png',
			'items':[],
			'options':[
				{
					'name' : '橡皮擦大小',
					'type' : 'select',
					'select_type' : 'number',
					'value' : 5,
					'range' : [1,20],
					'conf_name' : 'rubber_size',
					'action_name' : Constants.AT_TOOL_SELECT
				},{
					'name' : '橡皮擦形状',
					'type' : 'select',
					'select_type' : 'text',
					'value' : 'round',
					'range' : ['round','square'],
					'range_name' : ['圆形','方形'],
					'conf_name' : 'rubber_linecap',
					'action_name' : Constants.AT_TOOL_SELECT
				}
			]
		},
		{	
			'tool':'pick',
			'name' : '吸管工具',
			'icon':' ./src/img/pick.png',
			'items':[],
			'options':[]
		},
		{	
			'tool':'line',
			'name' : '直线',
			'icon':' ./src/img/line.png',
			'items':[],
			'options':[
				{
					'name' : '粗细',
					'type' : 'select',
					'select_type' : 'number',
					'value' : 5,
					'range' : [1,20],
					'conf_name' : 'line_size',
					'action_name' : Constants.AT_TOOL_SELECT
				},{
					'name' : '直线末端',
					'type' : 'select',
					'select_type' : 'text',
					'value' : 'round',
					'range' : ['round','square'],
					'range_name' : ['圆形','方形'],
					'conf_name' : 'line_linecap',
					'action_name' : Constants.AT_TOOL_SELECT
				},{
					'name' : '直线样式',
					'type' : 'select',
					'select_type' : 'text',
					'value' : 'default',
					'range' : ['default','dash'],
					'range_name' : ['默认','虚线'],
					'conf_name' : 'line_style',
					'action_name' : Constants.AT_TOOL_SELECT
				}
			]
		},
		{	
			'tool':'rectangle',
			'name' : '矩形工具',
			'icon':' ./src/img/rectangle.png',
			'items':[],
			'options':[
				{
					'name' : '边框粗细',
					'type' : 'select',
					'select_type' : 'number',
					'value' : 1,
					'range' : [1,10],
					'conf_name' : 'rectangle_size',
					'action_name' : Constants.AT_TOOL_SELECT
				},{
					'name' : '矩形样式',
					'type' : 'select',
					'select_type' : 'text',
					'value' : 'stroke',
					'range' : ['stroke','fill'],
					'range_name' : ['描边','填充'],
					'conf_name' : 'rectangle_style',
					'action_name' : Constants.AT_TOOL_SELECT
				}
			]
		},
		{	
			'tool':'ellipse',
			'name' : '椭圆工具',
			'icon':' ./src/img/ellipse.png',
			'items':[],
			'options':[
				{
					'name' : '边框粗细',
					'type' : 'select',
					'select_type' : 'number',
					'value' : 1,
					'range' : [1,10],
					'conf_name' : 'ellipse_size',
					'action_name' : Constants.AT_TOOL_SELECT
				},{
					'name' : '椭圆样式',
					'type' : 'select',
					'select_type' : 'text',
					'value' : 'stroke',
					'range' : ['stroke','fill'],
					'range_name' : ['描边','填充'],
					'conf_name' : 'ellipse_style',
					'action_name' : Constants.AT_TOOL_SELECT
				}
			]
		}
	]
};

Config.Color = [0,0,0];
Config.Tool = Config.AsideTools.fn[0].tool;

module.exports = Config;