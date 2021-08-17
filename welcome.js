module.exports = (client) => {
    const channelId = "831087681400078387";
    client.on("guildMemberAdd", (member) => {
      console.log(member);
  
      const message = `Willkommen auf Greenlifrp <@${
        member.id
      }> to our server! Be sure to check out our ${member.guild.channels.cache
        .get(rulesChannel)
        .toString()}`;
  
      const channel = member.guild.channels.cache.get(channelId);
      channel.send(message);
    });
  };
  