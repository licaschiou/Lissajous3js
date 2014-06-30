function LissajousCurve(){
  this.sizeX=80.0,
  this.sizeY=80.0,
  this.sizeZ=80.0,
  this.fa=4.0,
  this.fb=3.0,
  this.fc=2.0,
  this.phaseX=0.0,
  this.phaseY=0.0,
  this.phaseZ=0.0,
  this.step=0.02;
  this.curveVertices = new Array();
  this.lines = new Array();
  this.numCurveVertices = 0.0; //Math.floor((Math.PI * 2 + this.step)/this.step)
  this.meterial = new THREE.LineBasicMaterial( { color: 0xcc0000 } );
  this.meshObject = new THREE.Object3D();
  this.color = "cc0000";
  /*
    parameters = {
      fa: 4.0,
      fb: 3.0,
      fc: 2.0,
      phaseX: 0.0,
      phaseY: 0.0,
      phaseZ: 0,0,
      step: 0.02
    };
  */
  this.setParameters = function(parameters){
    this.color = parameters.color;
    this.fa = parameters.fa;
    this.fb = parameters.fb;
    this.fc = parameters.fc;

    this.phaseX = parameters.phaseX;
    this.phaseY = parameters.phaseY;
    this.phaseZ = parameters.phaseZ;

    this.step = parameters.step;
    this.numCurveVertices = Math.floor((Math.PI * 2 + this.step)/this.step);
  }

  this.clearMesh = function(){
    var numChildren = this.meshObject.children.length;
    if(numChildren > 0){
      for(var i = numChildren - 1; i >= 0; i--){
        this.meshObject.remove(this.meshObject.children[i]);
      }
    }
  }
  
  this.createMesh = function(){
    this.numCurveVertices = Math.floor((Math.PI * 2 + this.step)/this.step);

    for(var i = 0; i < this.numCurveVertices; i++){
      this.curveVertices[i] = new THREE.Vector3();
    }

    var angle=0.0;
    for(var i = 0; i < this.numCurveVertices; i++){    
      this.curveVertices[i].x = this.sizeX*Math.sin(this.fa*angle + this.phaseX);
      this.curveVertices[i].y = this.sizeY*Math.sin(this.fb*angle + this.phaseY);
      this.curveVertices[i].z = this.sizeZ*Math.sin(this.fc*angle + this.phaseZ);
      angle += this.step;
    }

    var lineGeometry = new THREE.Geometry();
    for(var i = 0; i < this.curveVertices.length - 1; i++){      
      var vertArray = lineGeometry.vertices;
      vertArray.push( this.curveVertices[i], this.curveVertices[i+1]);
      lineGeometry.computeLineDistances();      
    }
    var lineMaterial = new THREE.LineBasicMaterial();
    lineMaterial.color.setHex( this.color.replace("#", "0x") );
    var line = new THREE.Line( lineGeometry, lineMaterial );
    this.meshObject.add(line);
  }

  this.update = function(){
    this.clearMesh();
    this.createMesh();
  }
  

}