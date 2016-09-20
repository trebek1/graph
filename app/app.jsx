
var React = require('react');
var ReactDOM = require('react-dom');

var LineChart = React.createClass({
 
    getInitialState:function(){
        return {
            width:800,
            height: 300,
            tooltip:{ display:false,data:{key:'',value:''}}
        	
        };
    },

    showToolTip:function(e){
	    e.target.setAttribute('fill', '#FFFFFF');
	 
	    this.setState({tooltip:{
	        display:true,
	        data: {
	            key:e.target.getAttribute('data-key'),
	            value:e.target.getAttribute('data-value')
	            },
	        pos:{
	            x:e.target.getAttribute('cx'),
	            y:e.target.getAttribute('cy')
	        }
	 
	        }
	    });
	},
	hideToolTip:function(e){
	    e.target.setAttribute('fill', '#7dc7f4');
	    this.setState({tooltip:{ display:false,data:{key:'',value:''}}});
	},

    render:function(){
        var data=[
            {day:'02-11-2016',count:180},
            {day:'02-12-2016',count:250},
            {day:'02-13-2016',count:150},
            {day:'02-14-2016',count:140},
            {day:'02-15-2016',count:140},
            {day:'02-16-2016',count:380},
            {day:'02-17-2016',count:100},
            {day:'02-18-2016',count:150},
            {day:'02-19-2016',count:496}
        ];
 
        var margin = {top: 5, right: 50, bottom: 20, left: 50},
            w = this.state.width - (margin.left + margin.right),
            h = this.state.height - (margin.top + margin.bottom);
 
        var parseDate = d3.timeParse("%m-%d-%Y");
        var formatTime = d3.timeFormat("%b %y")
 		data.forEach(function (d) {
            d.date = parseDate(d.day);
            d.d = formatTime(d.date);
            
            
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


        data.forEach(function (d) {
            d.date = parseDate(d.day);
            d.starcraft = x(d.date)
          
        });


        var yAxis = d3.axisLeft()
            .scale(y)
            .ticks(5)
            .tickSizeOuter([0])

        
		var xAxis = d3.axisBottom()
		   .scale(x)
		   .tickValues(data.map(function(d,i){
		       		
		       	return d.date;
		       
		        
		   }).splice(1))

		   .tickFormat(function (d) {
		  
			  
		  return d3.timeFormat('%a %d')(new Date(d))
		})
		 
		 // .tickFormat(function (d) {
			//   var mapper = {
			//     "This": "This is long",
			//     "That": "That is long",
			//     "Other": "Other is long"
			//   }
			//   return mapper[d]
			// })
		 
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
                        <Dots data={data} x={x} y={y} showToolTip={this.showToolTip} hideToolTip={this.hideToolTip}/>
                        <ToolTip tooltip={this.state.tooltip}/>
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

var ToolTip = React.createClass({
    propTypes: {
        tooltip:React.PropTypes.object
    },

    render: function(){
 
        var visibility="hidden";
        var transform="";
        var x=0;
        var y=0;
        var width=150,height=70;
        var transformText='translate('+width/2+','+(height/2-5)+')';
        var transformArrow="";
 
        if(this.props.tooltip.display === true){
            var position = this.props.tooltip.pos;
 
            x = position.x;
            y = position.y;
            visibility = "visible";
 
 
            if(y > height){
                transform='translate(' + (x-width/2) + ',' + (y-height-20) + ')';
                transformArrow='translate('+(width/2-20)+','+(height-2)+')';
            }else if(y < height){
 
                transform='translate(' + (x-width/2) + ',' + (Math.round(y)+20) + ')';
                transformArrow='translate('+(width/2-20)+','+0+') rotate(180,20,0)';
            }
 
        }else{
            visibility="hidden"
        };
 
        return(
            <g transform={transform}>
                <rect class="shadow" is width={width} height={height} rx="5" ry="5" visibility={visibility} fill="#6391da" opacity=".9"/>
                <polygon class="shadow" is points="10,0  30,0  20,10" transform={transformArrow}
                         fill="#6391da" opacity=".9" visibility={visibility}/>
                <text is visibility={visibility} transform={transformText}>
                    <tspan is x="0" text-anchor="middle" font-size="15px" fill="#ffffff">{this.props.tooltip.data.key}</tspan>
                    <tspan is x="0" text-anchor="middle" dy="25" font-size="20px" fill="#a9f3ff">{this.props.tooltip.data.value+" visits"}</tspan>
                </text>
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
		var formatTime = d3.timeFormat("%b %e %Y")

    			console.log(_this.props.x(d.date))
			return (
					<circle className="dot" r="7" cx={_this.props.x(d.date)} cy={_this.props.y(d.count)} 
					fill="#7dc7f4" stroke="#3f5175" strokeWidth="5px" key={i}
                    onMouseOver={_this.props.showToolTip} 
                    onMouseOut={_this.props.hideToolTip}
                    data-key={formatTime(d.date)} 
                    data-value={d.count}/>
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