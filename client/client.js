
const svg=document.getElementById("sim")
const dimention =svg.getBoundingClientRect();
const width=dimention.width;
const height=dimention.height;

const answerRad = 250;
const xy_center = 400;

//const svg = DOM.svg(width,height)
let data= ({
    "puck": {
      "x":xy_center,
      "y":xy_center,
    },
    "player" : [{"id":1,"ang":0}],//,{"id":2,"ang":180},{"id":3,"ang":50}],
    "question" : ["What restaurant is the best?"],
    "answers": ["Indian","Mexican","German","Chinese","Italy"]
  }) 
  

const mag="M40.58 130.95C39.94 159.94 39.94 186.96 40.58 212C41.55 249.56 -40.59 246.59 -40.59 212C-40.59 188.94 -40.59 161.92 -40.59 130.95";
const d="m-20.492,0.7172l0,0c0,-11.56447 9.37485,-20.93932 20.93932,-20.93932l0,0c5.55345,0 10.87945,2.2061 14.80633,6.13299c3.92688,3.92688 6.13299,9.25288 6.13299,14.80634l0,0c0,11.56447 -9.37485,20.93932 -20.93932,20.93932l0,0c-11.56447,0 -20.93932,-9.37486 -20.93932,-20.93932zm10.46966,0l0,0c0,5.78223 4.68743,10.46966 10.46966,10.46966c5.78224,0 10.46966,-4.68743 10.46966,-10.46966c0,-5.78223 -4.68743,-10.46966 -10.46966,-10.46966l0,0c-5.78223,0 -10.46966,4.68743 -10.46966,10.46966z";
 

const getAngle = function( x1, y1, x2, y2 ) {
	const	dx = x1 - x2,
	dy = y1 - y2;
	  
	return Math.atan2(dy,dx)*(180/Math.PI)+180; 
};
  
  
function update(d,i){
    const mouse=d3.mouse(svg)
    
    //console.log(data.puck.x,data.puck.y,mouse[0],mouse[1])
    data.player[0].ang=getAngle(data.puck.x,data.puck.y,mouse[0],mouse[1])
    //console.log(data.player[0].ang)
    const puckG = d3.select("svg").selectAll("g")
    puckG.selectAll("#mags").transition()
        .duration(50)
        .attr("transform",d => `scale (0.25) rotate(${d.ang-90})`);
    
}
  
function loop(){
    let angles = []
    data.player.forEach(key => {
      angles.push(key.ang)
    });
          
    const puckVec = angles.reduce(
        (T, a) => {
            const xx = 0.5 * Math.cos(a * Math.PI / 180)
            const yy = 0.5 * Math.sin(a * Math.PI / 180)
            return [T[0] + xx, T[1] + yy]
        },
        [0, 0]
    )
    
    const answerPositions = data.answers.map((a, i) => {
        const angle = (2*Math.PI)/data.answers.length * (i)
        const xx = xy_center + answerRad * Math.cos(angle)
        const yy = xy_center + answerRad * Math.sin(angle)
        return [xx, yy]
    });
    const distences = answerPositions.map((a,i) => {
        const [xx,yy] = a;
        
        const diff_xx = xx - data.puck.x;
        const diff_yy = yy - data.puck.y;
        const dis = Math.sqrt( diff_xx*diff_xx + diff_yy*diff_yy );
        return dis
    });

    const answerForces= answerPositions.map((a,i) => {
        const [xx,yy] = a;
        
        const diff_xx = xx - data.puck.x;
        const diff_yy = yy - data.puck.y;
        return [diff_xx,diff_yy]
    });

    const answerForce = answerForces.reduce(
        (T, a) => {
            if (200>Math.sqrt(a[0]*a[0] + a[1]*a[1])){
             const xx = a[0];
             const yy = a[1];
             return [T[0] + xx, T[1] + yy]
            }else{
                return [T[0],T[1]];
            }
            
        },
        [0, 0]
    )

    
    
    console.log("Forces",distences,answerPositions,answerForce)
    const factor = Math.exp(-0.6*Math.min.apply(Math,distences))
    console.log("Factor",factor)
    data.puck.x=data.puck.x+(1-factor)*puckVec[0]+factor*answerForce[0];
    data.puck.y=data.puck.y+(1-factor)*puckVec[1]+factor*answerForce[1];
    console.log(puckVec,angles)
    d3.select("svg").selectAll("#puckGroup").transition()
                 .duration(50)
                 .attr("transform", d => `translate( ${d.puck.x} ${d.puck.y})`)
  
  
  }
  
  d3.select("svg")
           .on("mousemove", update)
           .on("click",loop);
  

  const answerCicle = d3.select("svg").selectAll("#answersG").data([data]).enter().append("g")
                .attr("id","answersG")
                .attr("transform", d => `translate(${d.puck.x} ${d.puck.y})`)

  const puckG = d3.select("svg").selectAll("#puckGroup").data([data]).enter().append("g")
                 .attr("transform", d => `translate( ${d.puck.x} ${d.puck.y})`)
                 .attr("id","puckGroup");
                 
 ;

 answerCicle.selectAll("#ring").data(data.answers).enter().append("circle")
                 .attr("id","ring")
                 .attr("r","250")
                 .attr("stroke","#000")
                 .attr("fill-opacity","0")
                 .attr("stroke-width","2");

 answerCicle.selectAll("#answers").data(data.answers).enter().append("circle")
                 .attr("id","answers")
                 .attr("r","6")
                 .attr("cx","250")
                 .attr("cy","0")
                 .attr("stroke","#000")
                 .attr("fill","#fff")
                 .attr("stroke-width","4")
                 .attr("transform", (d,i) => `rotate(${360/data.answers.length*i})`)


answerCicle.selectAll("#answers-Text").data(data.answers).enter().append("text")
                 .attr("id","answers-Text")
                 .attr("x","270")
                 .attr("y","0")
                 .attr("font-family", "sans-serif")
                 .attr("font-size", "20px")
                 .attr("alignment-baseline","middle")
                 .text(d => d)
                 .attr("transform", (d,i) => `rotate(${360/data.answers.length*i})`)                
  
  puckG.selectAll("#puck").data([data]).enter().append("path")
                 .attr("d",d)
                 .attr("id","puck")
                 .attr("fill","#fff")
                 .attr("stroke","#000")
                 .attr("stroke-width","4")
                 .attr("transform",d => `scale (1.1)`);
                
  
                   
  puckG.selectAll("#mags").data(data.player).enter().append("path")
                 .attr("d",mag)
                 .attr("id","mags")
                 .attr("fill","#fff")
                 .attr("fill-opacity","0")
                 .attr("stroke","#000")
                 .attr("stroke-width","22")
                 .attr("transform",d => `scale (0.25) rotate(${d.ang-90})`);
 
 
//window.setInterval(loop, 1000)
 

  

  