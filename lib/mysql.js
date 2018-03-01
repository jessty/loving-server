const mysql = require('mysql')
const {database:db} = require('../config/default')
// const userModel = require('./userModel')

const pool = mysql.createPool({
  host: db.host,
  user: db.user,
  password: db.password,
  database: db.database
})

const query = function(sql) {
  
  return new Promise((resolve, reject) => {

    pool.getConnection(function(err, connection) {

      if(err) {

        reject(err)

      } else {
        console.log('sql', sql)
        connection.query(sql, (err, rows, fields) => {

          err ? reject(err) : resolve(rows)

          connection.release()
        })
      }

    })
  })
}
const search = `CREATE  OR REPLACE VIEW search AS
select idUser, credit, bean, rank, phone, email, imgDir, avator, quote,
nickname, gender, birthday, height, weight, education, livingPlace, salary,
birthplace, domicile, nation, blood, houseStatus, carStatus,
preHeight, preWeight, preAge, preGender, preEdu, preLivingPlace, preSalary

from user natural join basic natural join details natural join prefer;`

const user = 'CREATE TABLE IF NOT EXISTS loving2.user ('+
    'idUser INT NOT NULL AUTO_INCREMENT, '+
    'psw CHAR(32) NOT NULL, '+
    'salt CHAR(8) NOT NULL, '+
    'credit FLOAT NOT NULL DEFAULT 0, '+
    'bean FLOAT NOT NULL DEFAULT 0, '+
    'rank TINYINT(1) NOT NULL DEFAULT 0, '+
    'phone CHAR(13) NULL, '+
    'email VARCHAR(45) NULL, '+
    'imgDir CHAR(8) NOT NULL UNIQUE, '+
    'avator VARCHAR(5) NULL, '+
    'quote VARCHAR(100) NULL, '+
    'signupTime DATETIME(3) NOT NULL, '+
    'loginTime DATETIME(3) NULL, '+
    'PRIMARY KEY (idUser));'


const prefer = `CREATE TABLE IF NOT EXISTS loving2.prefer (
  idPrefer INT NOT NULL AUTO_INCREMENT,
  idUser INT NOT NULL,
  preHeight TINYINT(2) NULL DEFAULT 0,
  preWeight TINYINT(2) NULL DEFAULT 0,
  preOther VARCHAR(100) NULL,
  preAge TINYINT(2) NULL DEFAULT 0,
  preGender TINYINT(2) NULL DEFAULT 0,
  preEdu TINYINT(2) NULL DEFAULT 0,
  preLivingPlace VARCHAR(30) NULL,
  preSalary TINYINT(2) NULL DEFAULT 0,
  UNIQUE INDEX idPrefer_UNIQUE (idPrefer ASC),
  PRIMARY KEY (idPrefer),
  INDEX preferBelong_idx (idUser ASC),
  CONSTRAINT preferBelong
    FOREIGN KEY (idUser)
    REFERENCES loving2.user (idUser)
    ON DELETE CASCADE
    ON UPDATE CASCADE);`


const indentify = `CREATE TABLE IF NOT EXISTS loving2.identify (
  idIden INT NOT NULL AUTO_INCREMENT,
  idUser INT NOT NULL,
  frontUrl VARCHAR(45) NOT NULL,
  backUrl VARCHAR(45) NOT NULL,
  idenTime DATETIME(3) NOT NULL,
  idenStatus TINYINT(1) NOT NULL DEFAULT 0,
  idenRemark VARCHAR(80) NULL,
  idAdmin INT NULL,
  checkTime DATETIME(3) NULL,
  PRIMARY KEY (idIden),
  INDEX iden_owner_idx (idUser ASC),
  CONSTRAINT iden_owner
    FOREIGN KEY (idUser)
    REFERENCES loving2.user (idUser)
    ON DELETE CASCADE
    ON UPDATE CASCADE);`

const basic = `CREATE TABLE IF NOT EXISTS loving2.basic (
  idBasic INT NOT NULL AUTO_INCREMENT,
  idUser INT(11) NOT NULL,
  nickname VARCHAR(30) NOT NULL,
  maritalStatus TINYINT(2) NULL DEFAULT 0 ,
  purpose TINYINT(2) NULL DEFAULT 0 ,
  gender TINYINT(2) NULL DEFAULT 0 ,
  birthday DATE NULL,
  height FLOAT NULL,
  weight FLOAT NULL,
  education TINYINT(2) NULL DEFAULT 0 ,
  livingPlace VARCHAR(30) NULL,
  salary TINYINT(2) NULL DEFAULT 0 ,
  PRIMARY KEY (idBasic),
  UNIQUE INDEX idBasic_UNIQUE (idBasic ASC),
  INDEX basicBelong_idx (idUser ASC),
  CONSTRAINT basicBelong
    FOREIGN KEY (idUser)
    REFERENCES loving2.user (idUser)
    ON DELETE CASCADE
    ON UPDATE CASCADE);`

const details = `CREATE TABLE IF NOT EXISTS loving2.details (
  idDetails INT NOT NULL AUTO_INCREMENT,
  idUser INT NOT NULL,
  birthplace VARCHAR(30) NULL,
  domicile VARCHAR(30) NULL,
  nation VARCHAR(20) NULL,
  blood TINYINT(2) NULL DEFAULT 0,
  religion TINYINT(2) NULL DEFAULT 0,
  houseStatus TINYINT(2) NULL DEFAULT 0,
  carStatus TINYINT(2) NULL DEFAULT 0,
  PRIMARY KEY (idDetails),
  UNIQUE INDEX idDetails_UNIQUE (idDetails ASC),
  INDEX detailsBelong_idx (idUser ASC),
  CONSTRAINT detailsBelong
    FOREIGN KEY (idUser)
    REFERENCES loving2.user (idUser)
    ON DELETE CASCADE
    ON UPDATE CASCADE);`

const loveStatus = `CREATE TABLE IF NOT EXISTS loving2.loveStatus (
  idLoveStatus INT NOT NULL AUTO_INCREMENT,
  idUser INT NOT NULL,
  singleDuration INT NULL DEFAULT 0,
  loveTimes INT NULL DEFAULT 0,
  reson VARCHAR(150) NULL,
  loveFactors VARCHAR(150) NULL,
  PRIMARY KEY (idLoveStatus),
  UNIQUE INDEX idLoveStatus_UNIQUE (idLoveStatus ASC),
  INDEX loveStatusBelong_idx (idUser ASC),
  CONSTRAINT loveStatusBelong
    FOREIGN KEY (idUser)
    REFERENCES loving2.user (idUser)
    ON DELETE CASCADE
    ON UPDATE CASCADE);`

const family = `CREATE TABLE IF NOT EXISTS loving2.family (
  idFamily INT NOT NULL AUTO_INCREMENT,
  idUser INT NOT NULL,
  parent TINYINT(2) NULL DEFAULT 0,
  familyRank TINYINT(2) NULL DEFAULT 0,
  child TINYINT(2) NULL DEFAULT 0,
  address VARCHAR(45) NULL,
  PRIMARY KEY (idFamily),
  UNIQUE INDEX idFamily_UNIQUE (idFamily ASC),
  INDEX familyBelong_idx (idUser ASC),
  CONSTRAINT familyBelong
    FOREIGN KEY (idUser)
    REFERENCES loving2.user (idUser)
    ON DELETE CASCADE
    ON UPDATE CASCADE);`

const hobby = `CREATE TABLE IF NOT EXISTS loving2.hobby (
  idHobby INT NOT NULL AUTO_INCREMENT,
  idUser INT NOT NULL,
  smoke TINYINT(2) NULL DEFAULT 0,
  drink TINYINT(2) NULL DEFAULT 0,
  schedule TINYINT(2) NULL DEFAULT 0,
  housework TINYINT(2) NULL DEFAULT 0,
  cooking TINYINT(2) NULL DEFAULT 0,
  pet TINYINT(2) NULL DEFAULT 0,
  travel TINYINT(2) NULL DEFAULT 0,
  sports VARCHAR(100) NULL,
  books VARCHAR(100) NULL,
  movies VARCHAR(100) NULL,
  music VARCHAR(100) NULL,
  PRIMARY KEY (idHobby),
  UNIQUE INDEX idHobby_UNIQUE (idHobby ASC),
  INDEX hobbyBelong_idx (idUser ASC),
  CONSTRAINT hobbyBelong
    FOREIGN KEY (idUser)
    REFERENCES loving2.user (idUser)
    ON DELETE CASCADE
    ON UPDATE CASCADE);`
const maritalExpec = `CREATE TABLE IF NOT EXISTS loving2.maritalExpec (
  idMaritalExpec INT NOT NULL AUTO_INCREMENT,
  idUser INT NOT NULL,
  maritalTime TINYINT(2) NULL DEFAULT 0,
  withParent TINYINT(2) NULL DEFAULT 0,
  childrenNum TINYINT(2) NULL DEFAULT 0,
  wedding VARCHAR(200) NULL,
  opion VARCHAR(200) NULL,
  PRIMARY KEY (idMaritalExpec),
  UNIQUE INDEX idMaritalExpec_UNIQUE (idMaritalExpec ASC),
  INDEX maritalExpecBelong_idx (idUser ASC),
  CONSTRAINT maritalExpecBelong
    FOREIGN KEY (idUser)
    REFERENCES loving2.user (idUser)
    ON DELETE CASCADE
    ON UPDATE CASCADE);`

const album= `CREATE TABLE IF NOT EXISTS loving2.album (
  idAlbum INT NOT NULL AUTO_INCREMENT,
  idUser INT NOT NULL,
  albumName VARCHAR(45) NOT NULL,
  albumTime DATETIME(3) NOT NULL,
  PRIMARY KEY (idAlbum),
  UNIQUE INDEX idAlbum_UNIQUE (idAlbum ASC),
  INDEX albumBelong_idx (idUser ASC),
  CONSTRAINT albumBelong
    FOREIGN KEY (idUser)
    REFERENCES loving2.user (idUser)
    ON DELETE CASCADE
    ON UPDATE CASCADE);
`
  
const mood = `CREATE TABLE IF NOT EXISTS loving2.mood (
  idMood INT NOT NULL AUTO_INCREMENT,
  idUser INT NOT NULL,
  mood VARCHAR(200) NULL,
  moodTime DATETIME(3) NOT NULL,
  PRIMARY KEY (idMood),
  UNIQUE INDEX idMood_UNIQUE (idMood ASC),
  INDEX moodBelong_idx (idUser ASC),
  CONSTRAINT moodBelong
    FOREIGN KEY (idUser)
    REFERENCES loving2.user (idUser)
    ON DELETE CASCADE
    ON UPDATE CASCAD);`

const imgs = `CREATE TABLE IF NOT EXISTS loving2.imgs (
  idImg INT NOT NULL AUTO_INCREMENT,
  idBelong INT NOT NULL,
  imgUrl VARCHAR(45) NULL,
  type TINYINT(2) NULL,
  PRIMARY KEY (idImg),
  UNIQUE INDEX idImg_UNIQUE (idImg ASC));`

const like = `CREATE TABLE loving2.like (
  idLike INT NOT NULL AUTO_INCREMENT,
  idLiking INT NOT NULL,
  idLiked INT NOT NULL,
  likeType TINYINT(2) NOT NULL,
  likeTime DATETIME(3) NOT NULL,
  PRIMARY KEY (idLike),
  UNIQUE INDEX idLike_UNIQUE (idLike ASC));`

const initUser = `
CREATE DEFINER= root@localhost PROCEDURE loving2.initUser(
    in email varchar(45),
    in phone char(13),
    in psw char(32),
    in salt char(8),
    in imgDir varchar(8),
    in signupTime datetime(3),
    in loginTime datetime(3),
    out idUser int
)
BEGIN
start transaction;

	insert into user set user.email = email, user.phone = phone, user.psw = psw, user.salt = salt, user.imgDir = imgDir, user.signupTime = signupTime, user.loginTime = loginTime;
    
  select user.idUser into idUser
  from user
  where user.phone = phone or user.email = email;
    
	insert into basic set basic.idUser = idUser ,basic.nickname = concat('用户-', idUser);
	insert into details set details.idUser = idUser;
  insert into family set family.idUser = idUser ;
  insert into hobby set hobby.idUser = idUser;
  insert into loveStatus set loveStatus.idUser = idUser;
  insert into maritalExpec set maritalExpec.idUser = idUser;
  insert into prefer set prefer.idUser = idUser;

commit;
END`
const createTable = function(sql) {
  return query(sql, []);
}
const createProc = function(sql) {
  return query(sql, []);
}

const initDB = async function() {
  await createTable(user)
  await createTable(indentify)
  await createTable(basic)
  await createTable(details)
  await createTable(loveStatus)
  await createTable(family)
  await createTable(hobby)
  await createTable(maritalExpec)
  await createProc(initUser)
}

module.exports = {
  initDB,
  query,
  createTable,
}