// require('../less/menu.less');

var React = require('react');
var Config = require('../js/config');

var AppStore = window.AppStore;
var AppDispatcher = window.AppDispatcher

var MenuItem = React.createClass({
  handleClick:function(){
      AppDispatcher.handleViewAction({
        'name' : this.props.action_name
      });
  },
	render : function(){
		return (
			<li>
        <a className={AppStore.isOptional(this.props.action_name)?'':'unclickable'} onClick={this.handleClick}>{this.props.name}</a>
      </li>
		)
	}
})

var MenuColumn = React.createClass({
	render : function () {
    var nodes = [],
        index = 0;

    for(var i in this.props.items){
      nodes.push( <MenuItem  key={'item-'+index}  name={this.props.items[i].name} action_name={this.props.items[i].action_name}/>);
      index++;
    }

		return(
			<li className={'btn-hover btn-active'+(this.props.show?' active':'')}>
				<a  onClick={this.props.handleChangeColumn.bind(null,this.props.column,'click')}
          onMouseOver={this.props.handleChangeColumn.bind(null,this.props.column,'mouseover')}
        >
          {this.props.column}
        </a>
				<ul className='menu_column' style={{'display':(this.props.show?'block':'none')}}>
					{nodes}
				</ul>	
			</li>
		)
	}
}) 

var Menu = React.createClass({
  active : function(column){
    this.setState({
        'active':true,
        'column': column
      })
  },
  inactive : function(){
     this.setState({
        'active':false,
        'column': ''
      })
  },
  handleChangeColumn : function(column,type,e){
    e.stopPropagation();
    e.preventDefault();
    if(type=='click' && !this.state.active || type=='mouseover' && this.state.active){
      this.active(column);
    }else{
      this.inactive();
    }
  },
  getInitialState :function() {
      return {
            'active': false, //是否正在激活状态
            'column' : ''
      };
  },
  getDefaultProps : function(){
    return Config.Menu;
  },
  render: function() {
    var self = this;

  	var nodes = [];
     this.props.columns.forEach(function(item,index){
          nodes.push( <MenuColumn key={'column-'+index}
            handleChangeColumn={self.handleChangeColumn}
            show={self.state.column==item.name?true:false}
            column={item.name} items={item.items}/> );
     })
    return (
      <div id="menu" onClick={this.handleChangeColumn.bind(null,'','')}>
      	  <span className='menu_brank'>cPs</span>	
	      <ul className='menu_title'>
	      	{nodes}
	      </ul>
      </div>
    );
  }
});

module.exports = Menu;