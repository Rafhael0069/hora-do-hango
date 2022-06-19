export class DataUser {
  private name: string;
  private email: string;
  private imgPerfil: string;
  constructor() {}

  getName(){
    return this.name;
  }
  setName(name: string){
    this.name = name;
  }
  getEmail(){
    return this.email;
  }
  setEmail(email: string){
    this.email = email;
  }
  getImgPerfil(){
    return this.imgPerfil;
  }
  setImgPerfil(imgPerfil: string){
    this.imgPerfil = imgPerfil;
  }
}
