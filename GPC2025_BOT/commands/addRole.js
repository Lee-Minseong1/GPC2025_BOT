module.exports = {
    name: 'addrole',
    description: '멘션한 유저에게 역할 수동 추가.',
    execute: async (message, args) => {
        console.log('addRole 명령어 감지됨:', message.content);

        const userMention = message.mentions.users.first();
        const roleMention = message.mentions.roles.first(); 
        const roleName = args.slice(1).join(' ');

        console.log('멘션된 유저:', userMention);
        console.log('멘션된 역할:', roleMention);
        console.log('역할명:', roleName);

        if (!userMention || (!roleMention && !roleName)) {
            return message.reply('사용법: !addRole @유저 역할명');
        }

        const guildMember = message.guild.members.cache.get(userMention.id);
        const role = roleMention || message.guild.roles.cache.find(r => r.name === roleName);

        if (!guildMember) {
            return message.reply('해당 유저를 서버에서 찾을 수 없습니다.');
        }

        if (!role) {
            return message.reply(`"${roleName}" 역할을 찾을 수 없습니다.`);
        }

        try {
            await guildMember.roles.add(role);
            message.reply(`${guildMember.user.username}에게 "${role.name}" 역할을 추가했습니다.`);
            console.log(`${guildMember.user.username}에게 "${role.name}" 역할 추가 성공.`);
        } catch (error) {
            console.error('역할 추가 중 오류:', error);
            message.reply('역할을 추가하는 중 문제가 발생했습니다.');
        }
    },
};
