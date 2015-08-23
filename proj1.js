ReparacoesCol = new Mongo.Collection('reparacoesCol');


if (Meteor.isClient) {
  Template.body.helpers({
    reparacoes: function(){
      return ReparacoesCol.find();
    } 
  });

  Template.body.events({
    'submit .nova-reparacao': function(event){
      //vai buscar o valor do title e insere na variavel tittle
      var titleVar = event.target.title.value;

      ReparacoesCol.insert({
        title: titleVar,
        createdAt: new Date()
      })
    //coloca a form de novo em branco
    event.target.title.value = "";
    //para impedir q faça refresh da pagina
    return false;
    }
  });

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
