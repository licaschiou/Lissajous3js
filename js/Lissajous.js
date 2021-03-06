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
  this.ribbonWidth = 5.0;
  this.curveVertices = new Array();
  this.ribbonVertices = new Array();
  this.lines = new Array();
  this.numCurveVertices = 0.0; 
  this.meterial = "Basic";
  this.meshObject = new THREE.Object3D();
  this.color = "#ffffff";
  this.meshType = "Line";
 
  this.setParameters = function(parameters){
    this.meshType = parameters.meshType;
    this.meterial = parameters.material;
    this.color = parameters.color;

    this.sizeX = parameters.sizeX;
    this.sizeY = parameters.sizeY;
    this.sizeZ = parameters.sizeZ;

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
    this.numCurveVertices = Math.floor((Math.PI * 2 + 4 * this.step)/this.step);

    for(var i = 0; i < this.numCurveVertices; i++){
      this.curveVertices[i] = new THREE.Vector3();
    }

    var angle = this.step
    for(var i = 0; i < this.numCurveVertices; i++){    
      this.curveVertices[i].x = this.sizeX*Math.sin(this.fa*angle + this.phaseX);
      this.curveVertices[i].y = this.sizeY*Math.sin(this.fb*angle + this.phaseY);
      this.curveVertices[i].z = this.sizeZ*Math.sin(this.fc*angle + this.phaseZ);
      angle += this.step;
    }

    var lissajourGeometry = new THREE.Geometry();
    var vertArray = lissajourGeometry.vertices;

    if(this.meshType == "Line"){
      for(var i = 0; i < this.curveVertices.length - 1; i++){
        vertArray.push( this.curveVertices[i], this.curveVertices[i+1]);
        lissajourGeometry.computeLineDistances();      
      }
      var lineMaterial = new THREE.LineBasicMaterial();
      lineMaterial.color.setHex( this.color.replace("#", "0x") );
      var line = new THREE.Line( lissajourGeometry, lineMaterial );
      this.meshObject.add(line);
    }

    if(this.meshType == "Ribbon"){
      for(var i = 0; i < this.curveVertices.length - 1; i++){
        var va = this.curveVertices[i].clone();
        var vb = this.curveVertices[i+1].clone();
        var vecAdd = new THREE.Vector3().addVectors(va, vb);
        var vecSub = new THREE.Vector3().subVectors(va, vb);
        var vecCrossNormal = new THREE.Vector3().crossVectors(vecAdd, vecSub);
        var vecCrossParallel = new THREE.Vector3().crossVectors(vecSub, vecCrossNormal);
        vecCrossParallel.normalize();
        vecCrossParallel.multiplyScalar(this.ribbonWidth);

        var newVertex = new THREE.Vector3().addVectors(va, vecCrossParallel);
        vertArray.push(newVertex);
        newVertex = new THREE.Vector3().subVectors(va, vecCrossParallel);
        vertArray.push(newVertex);

        //checking inversing vertex
        if(vertArray.length > 4){
          var v0 = vertArray[vertArray.length-4].clone();
          var v1 = vertArray[vertArray.length-3].clone();
          var v2 = vertArray[vertArray.length-2].clone();
          var v3 = vertArray[vertArray.length-1].clone();
          var v02 = new THREE.Vector3().subVectors(v0, v2);
          var v03 = new THREE.Vector3().subVectors(v0, v3);
          if(v03.length() <= v02.length()){
            vertArray[vertArray.length-1] = v2.clone();
            vertArray[vertArray.length-2] = v3.clone();
          }
        }    

        if( i < this.curveVertices.length - 2){
          lissajourGeometry.faces.push(new THREE.Face3(i*2, i*2+1, i*2+2));
          lissajourGeometry.faces.push(new THREE.Face3(i*2+2, i*2+1, i*2+3));
        }        
      }

      lissajourGeometry.computeCentroids();
      lissajourGeometry.computeFaceNormals();
      var ribbonMaterial;
      if (this.meterial == "Basic")
        ribbonMaterial = new THREE.MeshBasicMaterial( {side: THREE.DoubleSide } );
      else if (this.meterial == "Lambert")
        ribbonMaterial = new THREE.MeshLambertMaterial( {side: THREE.DoubleSide } );
      else if (this.meterial == "Phong")
        ribbonMaterial = new THREE.MeshPhongMaterial( {side: THREE.DoubleSide } );
      else if (this.meterial == "Wireframe")
        ribbonMaterial = new THREE.MeshBasicMaterial( { wireframe: true } );
      ribbonMaterial.color.setHex( this.color.replace("#", "0x") );
      var ribbon = new THREE.Mesh( lissajourGeometry, ribbonMaterial );
      this.meshObject.add(ribbon);
    }    
    
  }

  this.update = function(){
    this.clearMesh();
    this.createMesh();
  }
  

}