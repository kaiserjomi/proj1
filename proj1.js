ReparacoesCol = new Mongo.Collection('reparacoesCol');


if (Meteor.isClient) {
  Template.body.helpers({
    reparacoes: function()
    {
      if (Session.get('hideFinished'))
        {
          return ReparacoesCol.find({checked: {$ne: true}});
        }
        else{
            return ReparacoesCol.find();
            }
    },
    hideFinished: function(){
      return session.Get('hideFinished');
    } 
  });

  Template.body.events({
    'submit .nova-reparacao': function(event){
      //vai buscar o valor do title e insere na variavel tittle
      var titleVar = event.target.titulo.value;
      var timeVar = event.target.tempo.value;
      Meteor.call("addReparacao", titleVar, timeVar);
      /*ReparacoesCol.insert({
        title: titleVar,
        time: timeVar,
        createdAt: new Date()
      })*/
    //coloca a form de novo em branco
    event.target.title.value = "";
    //para impedir q faça refresh da pagina
    return false;
    },

    'change .hide-finished': function(event){
      //vai criar esta session e colocar lá o valor que o checked tiver.
      Session.set('hideFinished', event.target.checked);
    }
  });

  Template.reparacao.events({
    'click .toggle-checked': function() {
      //para colocar as repaçoes já realizadas para o fim da lista
      //a forma como o find funciona coloca no fim os checked
      ReparacoesCol.update(this._id, {$set: {checked: !this.checked}});
    },

    'click .delete': function()
      {
        ReparacoesCol.remove(this._id);
      } 
 });

     //Para configurar para fazer login por username em vez de email
    Accounts.ui.config({
      passwordSignupFields: "USERNAME_ONLY"
    });

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}


Meteor.methods({
  addReparacao: function(titleVar, timeVar){
   ReparacoesCol.insert({
        title: titleVar,
        time: timeVar,
        createdAt: new Date()
      }); 
  }
});