const Discord = require('discord.js')
const bot = new Discord.Client()
const fs = require('fs')
const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });
const reactionRolesConfig = JSON.parse(fs.readFileSync('reactionroles.json' , 'utf8'))
const prefix = 't!'

    bot.user.setPresence({
        activity: {
            name: 't!server',
            type: 'PLAYING',
        }
    })


bot.on('message', message => {
    let parts = message.content.split(" ");

    if(parts[0] == 'help') {
        message.channel.send('**Hier meine Befehle**\n**t!clear**/**t!purge** - Löscht bis zu 100 Nachrichten\n**t!member** - Sagt dir, wieviele Mitglieder der Server hat, auf dem du dich befindest.\n**t!owner** - Sagt dir, wer der die Eigentumsrechte von einem Server hat.\n**t!userinfo <@>** - Damit kannst du dir die Benutzerinfo von dir oder jmd anderes anzeigen lassen')
    }
    else if(parts[0] == 't!clear' || parts[0] == 't!purge') {
        if(!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send('Du brauchst die Berechtigung, Nachrichten zu löschen!')
        if(!parts[1]) return message.channel.send('Du musst angeben, wieviele Nachrichten du löschen möchtest!')
        if(isNaN(parts[1])) return message.channel.send('Die Angabe, wieviele Nachrichten du löschen möchtest, muss eine Zahl sein!')
        if(parts[1] > 100) return message.channel.send('Du kannst nicht mehr als 100 Nachrichten löschen!')
        if(parts[1] < 2) return message.channel.send('Du kannst nicht weniger als 2 Nachricht löschen')
        message.channel.bulkDelete(parts[1])
        message.channel.send(`Ich habe erfolgreich **${parts[1]}** Nachrichten gelöscht!`).then(m => m.delete({timeout: 3000}))
    }
    else if(parts[0] == 't!member') {
        message.channel.send(`Der **${message.guild.name}**-Server hat gerade **${message.guild.members.cache.filter(m => m.user.bot).size}** Mitglieder!`)
    }
    else if(parts[0] == 't!owner') {
        message.channel.send(`Der Owner vom **${message.guild.name}**-Server ist **${message.guild.owner.user.tag}**`)
    }
    else if(parts[0] == 't!userinfo') {

        const guild = message.guild
        const usr = message.mentions.users.first() || message.author
        const member = guild.members.cache.get(usr.id)

        const userr = member.user

        const embed = new Discord.MessageEmbed()
        .setColor('69e3e2')
        .setAuthor(`${usr.tag}`, `${usr.displayAvatarURL({dynamic: true})}`)
        .setThumbnail(`${usr.displayAvatarURL({dynamic: true})}`)
        .setDescription(`${usr}'s Informationen`)
        .addField('**Name + ID:**', `${usr.tag}`)
        .addField('**ID:**', `${usr.id}`)
        .addField('**Avatar URL:**', `${usr.displayAvatarURL({dynamic: true})}`)
        .addField('**Nickname (Wenn vorhanden):**', `${member.nickname || `Der Benutzer hat keinen Nickname`}`)
        .addField('**Dem Server gejoined:**', `${member.joinedAt}`)
        .addField('**Discord gejoined**', `${usr.createdAt}`)
        .addField('**Status:**', `${userr.presence.status}`)
        .addField('**Bot:**', `${usr.bot}`)
        .addFields({
            name: '**Rollenmenge:**',
            value: member.roles.cache.size - 1,
        })

        message.channel.send(embed)
    }
    else if(message.content.includes('<@!BOTID>')) {
        const embed = new Discord.MessageEmbed()
        .setColor('ff0000')
        .setTitle('**Was gibts?**')
        .addField('Brauchst du Hilfe?', 'Benutze t!help')
        .addField('Willst du dem Owner eine FA schicken?', `Hier der Name: **${message.guild.owner.user.tag}**`)
        .addField('Brauchst du bei sonst etwas Hilfe?', 'Wende dich an den Owner oder das Team')

        message.channel.send(embed)
    }
    else if(message.content.includes('t!server')) {
        const embed = new Discord.MessageEmbed()
        .setColor('ff0000')
        .setTitle('**Was gibts?**')
        .addField('Brauchst du Hilfe beim Server?', 'Frag unser Team')
        .addField('Du kommst nicht auf denn Server ?', 'Hier die IP  185.249.198.9:30484')

        message.channel.send(embed)
    }
    client.on('ready', () => {
        console.log(`Logged in as ${client.user.tag}!`);
      });
      
      
      
      client.on("messageReactionAdd", async (reaction, user) => {
        if(reaction.message.partial) reaction.fetch();
        if(reaction.partial) reaction.fetch();
        if(user.bot || !reaction.message.guild) return;
      
        for (let index = 0; index < reactionRolesConfig.reactions.length; index++) {
          let reactionrole = reactionRolesConfig.reactions[index];
      
          if(reaction.message.id == reactionrole.message && reaction.emoji.name == reactionrole.emoji){
            reaction.message.guild.members.cache.get(user.id).roles.add(reactionrole.role)
          }
        }
      })
      
      client.on("messageReactionRemove", async (reaction, user) => {
        if(reaction.message.partial) reaction.fetch();
        if(reaction.partial) reaction.fetch();
        if(user.bot || !reaction.message.guild) return;
      
        for (let index = 0; index < reactionRolesConfig.reactions.length; index++) {
          let reactionrole = reactionRolesConfig.reactions[index];
      
          if(reaction.message.id == reactionrole.message && reaction.emoji.name == reactionrole.emoji && reaction.message.guild.members.cache.get(user.id).roles.cache.has(reactionrole.role)){
            reaction.message.guild.members.cache.get(user.id).roles.remove(reactionrole.role)
          }
        }
      })
      
      
      
      client.on('message', async (msg) => {
        if(msg.author.bot || !msg.guild) return;
        if(msg.content.startsWith('!createReactionRole') && msg.member.hasPermission('ADMINISTRATOR')){
          var args = msg.content.split(' ');
          if(args.length == 3){
            var emoji = args[1];
            var roleid = args[2]
            var role = msg.guild.roles.cache.get(roleid);
            if(!role){
              msg.reply('die rolle gibt es nicht')
              return;
            } 
            var embed = new Discord.MessageEmbed()
            .setTitle('Klicke auf ' + emoji)
            .setDescription('Klicke auf ' + emoji + " um die Rolle " + `<@&${role.id}>` + " zu bekomme oder sie zu entfernen");
            var message = await msg.channel.send(embed)
            message.react(emoji)
            var toSave = {message: message.id, emoji: emoji,role: roleid}
            reactionRolesConfig.reactions.push(toSave);
            let data = JSON.stringify(reactionRolesConfig);
            fs.writeFileSync('reactionroles.json', data);   
           }
        }
      
      })
})

bot.login(process.env.token)