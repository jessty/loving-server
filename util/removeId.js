module.exports = (values) => {
  delete values.idUser

  // img model
  delete values.idImg
  delete values.idBelong

  // iden model
  delete values.idIden

  // album model
  delete values.idAlbum
  
  // likes model
  delete values.idLike
}