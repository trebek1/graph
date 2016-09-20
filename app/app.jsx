
var React = require('react');
var ReactDOM = require('react-dom');

var LineChart = React.createClass({
 
    getInitialState:function(){
        return {
            width:800,
            height: 300
        };
    },
    render:function(){
        var data=[
            {day:'02-11-2016',count:180},
            {day:'02-12-2016',count:250},
            {day:'02-13-2016',count:150},
            {day:'02-14-2016',count:496},
            {day:'02-15-2016',count:140},
            {day:'02-16-2016',count:380},
            {day:'02-17-2016',count:100},
            {day:'02-18-2016',count:150}
        ];
 
        var margin = {top: 5, right: 50, bottom: 20, left: 50},
            w = this.state.width - (margin.left + margin.right),
            h = this.state.height - (margin.top + margin.bottom);
 
        var parseDate = d3.timeParse("%m-%d-%Y");
 
        data.forEach(function (d) {
            d.date = parseDate(d.day);
        });
 
        var x = d3.scaleTime()
            .domain(d3.extent(data, function (d) {
                return d.date;
            }))
            .rangeRound([0, w]);
 
        var y = d3.scaleLinear()
            .domain([0,d3.max(data,function(d){
                return d.count+100;
            })])
            .range([h, 0]);

        var y2 = d3.scaleLinear()
            .domain([0,d3.max(data,function(d){
                return d.count+100;
            })])
            .range([h, 0]);
 
        var line = d3.line()
            .x(function (d) {
                return x(d.date);
            })
            .y(function (d) {
                return y(d.count);
            }).curve(d3.curveCatmullRom.alpha(0.5));
 
        var transform='translate(' + margin.left + ',' + margin.top + ')';
        
        var yAxis = d3.axisLeft()
            .scale(y)
            .ticks(5)
            .tickSizeOuter([0])

 
		var xAxis = d3.axisBottom()
		   .scale(x)
		   .tickValues(data.map(function(d,i){
		       if(i>0)
		           return d.date;
		   }).splice(1))
		   .ticks(4);
		 
		var yGrid = d3.axisLeft()
		   .scale(y)
		   .ticks(5)
		   .tickSize(-w, 0, 0)
		   .tickSizeOuter(0,0)
		   .tickFormat("")
		   
 
        return (
            <div id='container'>
                <svg id ='svg' width={this.state.width} height={this.state.height}>
 
                    <g transform={transform}>
                        
                        
                        <Grid h={h} grid={yGrid} gridType="y"/>
						<Axis h={h} axis={yAxis} axisType="y" />
						<Axis h={h} axis={xAxis} axisType="x"/>
                        <path className="line shadow" d={line(data)} strokeLinecap="round"/>
                        <Dots data={data} x={x} y={y}/>
                    </g>
                </svg>
            </div>
        );
    }
});


var Axis = React.createClass({
    propTypes: {
        h:React.PropTypes.number,
        axis:React.PropTypes.func,
        axisType:React.PropTypes.oneOf(['x','y'])
    },
    componentDidUpdate: function(){ 
    	this.renderAxis(); 
    },
    componentDidMount: function(){ 
    	this.renderAxis(); 
    },
    renderAxis: function () {
        var node = ReactDOM.findDOMNode(this);
        d3.select(node).call(this.props.axis);
    },
    render: function () {
        var translate = "translate(0,"+(this.props.h)+")";
 
        return (
            <g className="axis" transform={this.props.axisType=='x'?translate:""} >
            </g>
        );
    }
 
});
 
var Grid = React.createClass({
    propTypes: {
        h:React.PropTypes.number,
        grid:React.PropTypes.func,
        gridType:React.PropTypes.oneOf(['x','y'])
    },
 
    componentDidUpdate: function(){ 
    	this.renderGrid(); 
    },
    componentDidMount: function(){ 
    	this.renderGrid(); 
    },
    renderGrid: function () {
        var node = ReactDOM.findDOMNode(this);
        d3.select(node).call(this.props.grid);
 
    },
    render: function () {
        var translate = "translate(0,"+(this.props.h)+")";
        return (
            <g className="y-grid" transform={this.props.gridType=='x'?translate:""}>
            </g>
        );
    }
 
});


var Dots = React.createClass({
	
	propTypes: {
		data: React.PropTypes.array,
		x: React.PropTypes.func,
		y: React.PropTypes.func

	},

	render: function(){

		var _this = this; 

		var data = this.props.data.splice(1);
			data.pop();

		var circles = data.map(function(d,i){
			return (
					<circle className = 'point' r="5" cx={_this.props.x(d.date)} cy={_this.props.y(d.count)} fill="#7dc7f4" stroke="#3f5175" strokeWidth="4px" key={i}/>
				)
		});

		return (
			<g> 
				{circles}
			</g>
			)

	}
})

var Chart = React.createClass({
    render:function(){
        return (
            <div>
                <div>
                    <LineChart/>
                </div>
            </div>
        )
    }
});


ReactDOM.render(
	<Chart/>, document.getElementById('app')
);