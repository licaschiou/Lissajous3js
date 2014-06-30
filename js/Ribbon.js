function Ribbon(){
  int numVertices,ribbonWidth;
  color ribbonColor;
  PVector[] trailVertices;
  PVector[] vertices;
  
  Ribbon(int iniNumVertices,int theWidth){
    numVertices=iniNumVertices;
    ribbonWidth=theWidth;
    trailVertices=new PVector[numVertices];
    vertices=new PVector[numVertices*2];
    for(int i=0; i<numVertices; i++){
      trailVertices[i]=new PVector();
      vertices[i*2]=new PVector();
      vertices[i*2+1]=new PVector();
    }
  }
  
  void updateTrailVertices(int index, PVector toSet){
    trailVertices[index].set(toSet);
  }
  
  void generateMesh(){    
    for(int i=0; i<trailVertices.length-1; i++){
      PVector v1=PVector.sub(trailVertices[i],trailVertices[i+1]);
      PVector v2=PVector.add(trailVertices[i+1],trailVertices[i]);
      PVector v3=v1.cross(v2);
      v2=v1.cross(v3);
      v2.normalize();
      v2.mult(ribbonWidth);
      vertices[i*2].set(trailVertices[i].x+v2.x,trailVertices[i].y+v2.y,trailVertices[i].z+v2.z);
      vertices[i*2+1].set(trailVertices[i].x-v2.x,trailVertices[i].y-v2.y,trailVertices[i].z-v2.z);
    }
  }
 
  void drawMesh(){
    beginShape(QUADS);
    for(int i=1; i<vertices.length-3; i+=2){
      vertex(vertices[i].x,vertices[i].y,vertices[i].z);
      vertex(vertices[i+2].x,vertices[i+2].y,vertices[i+2].z);
      vertex(vertices[i+3].x,vertices[i+3].y,vertices[i+3].z);
      vertex(vertices[i+1].x,vertices[i+1].y,vertices[i+1].z);      
    }
//    vertex(vertices[vertices.length-3].x,vertices[vertices.length-3].y,vertices[vertices.length-3].z);
//    vertex(vertices[vertices.length-1].x,vertices[vertices.length-1].y,vertices[vertices.length-1].z);
//    vertex(vertices[0].x,vertices[0].y,vertices[0].z);
//    vertex(vertices[vertices.length-2].x,vertices[vertices.length-2].y,vertices[vertices.length-2].z); 
    endShape();
  }

}