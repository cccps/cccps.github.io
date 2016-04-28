var Constants = {

	HISTORY_MAX : 5,

	AT_ALERT : 'action_alert',

	//action to change view
	AT_FILE_NEW :'action_create_new_file',
	AT_FILE_SELECT :'action_select_file',
	AT_FILE_SELECT_ADD :'action_select_file_add',
	AT_FILE_INFO :'action_file_info',


	//file、 layer
	AT_DATA_FILE_NEW :'action_data_create_new_file',
	AT_DATA_FILE_SELECT :'action_data_select_file',
	AT_DATA_FILE_SELECT_ADD :'action_data_select_file_add',
	AT_DATA_FILE_SAVE :'at_data_file_save',
	AT_DATA_FILE_INFO :'action_data_file_info',
	AT_DATA_FILE_EXPORT : 'at_data_file_export',

	AT_DATA_FILE_ACTIVE :'action_data_file_active',
	AT_DATA_FILE_CLOSE :'action_data_file_close',
	AT_DATA_COLOR :'action_data_color',
	AT_DATA_LAYER_ACTIVE : 'action_data_layer_active',
	AT_DATA_LAYER_TOGGLE_SHOW : 'action_data_layer_toggle_show',
	AT_DATA_LAYER_RENAME : 'action_data_layer_rename',
	AT_DATA_LAYER_ADD: 'action_data_layer_add',
	AT_DATA_LAYER_DEL: 'action_data_layer_del',
	AT_DATA_LAYER_COPY: 'action_data_layer_copy',
	AT_DATA_LAYER_UPGRADE: 'action_data_layer_upgrade',
	AT_DATA_LAYER_DEGRADE: 'action_data_layer_degrade',
	AT_DATA_LAYER_TOP: 'action_data_layer_to_top',
	AT_DATA_LAYER_BOTTOM: 'action_data_layer_to_bottom',
	AT_DATA_LAYER_LARGER: 'action_data_layer_larger',
	AT_DATA_LAYER_SMALLER: 'action_data_layer_smaller',
	AT_DATA_LAYER_ANTICLOCKWISE: 'action_data_layer_anticlockwise',
	AT_DATA_LAYER_CLOCKWISE: 'action_data_layer_to_clockwise',
	
	AT_DATA_LAYER_GRAYING: 'action_data_layer_graying',
	AT_DATA_LAYER_OPPOSITION: 'at_data_layer_opposition',
	AT_DATA_LAYER_PIXELATE: 'at_data_layer_pixelate',
	AT_DATA_LAYER_BLUR: 'at_data_layer_blur',





	//menu
	AT_DATA_PREV : 'at_data_prev',
	AT_DATA_NEXT : 'at_data_next',

	//action to change tools config
	AT_TOOL_ACTIVE :'action_tool_active',


	//action from move tool
	AT_TOOL_MOVE : 'at_tool_move',
	AT_TOOL_MOVE_UP : 'at_tool_move_mouseup',
	AT_TOOL_DRAW : 'at_tool_draw',
	AT_TOOL_DRAW_UP : 'at_tool_draw_mouseup',
	AT_TOOL_DRAW_PAINTING : 'at_tool_draw_painting',
	AT_TOOL_DRAW_HANDLE: 'at_tool_draw_hanlde_history',

	AT_TOOL_LINE : 'at_tool_line',
	AT_TOOL_LINE_UP : 'at_tool_line_mouseup',
	AT_TOOL_LINE_PAINTING : 'at_tool_drawing_line',
	AT_TOOL_LINE_HANDLE: 'at_tool_hanlde_line',

	AT_TOOL_RECTANGLE : 'at_tool_rectangle',
	AT_TOOL_RECTANGLE_UP : 'at_tool_rectangle_mouseup',
	AT_TOOL_RECTANGLE_PAINTING : 'at_tool_drawing_rectangle',
	AT_TOOL_RECTANGLE_HANDLE: 'at_tool_hanlde_rectangle',

	AT_TOOL_ELLIPSE : 'at_tool_ellipse',
	AT_TOOL_ELLIPSE_UP : 'at_tool_ellipse_mouseup',
	AT_TOOL_ELLIPSE_PAINTING : 'at_tool_drawing_ellipse',
	AT_TOOL_ELLIPSE_HANDLE: 'at_tool_hanlde_ellipse',

	//action from tool options
	AT_TOOL_CHECKBOX : 'at_tool_checkbox',
	AT_TOOL_SELECT : 'at_tool_select',
};


module.exports = Constants;