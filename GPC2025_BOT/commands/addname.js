module.exports = {
    name: 'name',
    description: '멘션한 유저 또는 디스코드 ID를 사용하여 닉네임을 변경합니다.',
    execute: async (message, args) => {
       
        const newNickname = args.slice(1).join(' ');

        if (!newNickname) {
            return message.reply('사용법: !name @유저 새로운닉네임 또는 !name 디스코드아이디 새로운닉네임');
        }

        const discordId = args[0]; 
        let guildMember;

        try {
            
            const members = await message.guild.members.fetch();

            // 디버깅 섹터
            console.log(`로드된 멤버 수: ${members.size}`);

            if (message.mentions.users.size > 0) {
                const userMention = message.mentions.users.first();
                guildMember = members.get(userMention.id);
            } else {
                guildMember = members.find(member => member.user.username === discordId);
            }
        } catch (error) {
            console.error('멤버 조회 중 오류:', error);
            return message.reply('멤버 정보를 가져오는 중 문제가 발생했습니다.');
        }
  
        if (!guildMember) {
            return message.reply('해당 유저를 서버에서 찾을 수 없습니다. 디스코드 ID 또는 멘션을 확인하세요.');
        }
     
        if (!message.guild.members.me.permissions.has('ManageNicknames')) {
            return message.reply('닉네임을 변경할 권한이 없습니다.');
        }

        if (guildMember.roles.highest.position >= message.guild.members.me.roles.highest.position) {
            return message.reply('이 유저의 닉네임을 변경할 수 없습니다. 역할 계층을 확인하세요.');
        }

        try {
            const oldNickname = guildMember.nickname || guildMember.user.username;
            await guildMember.setNickname(newNickname);
            message.reply(`${guildMember.user.username}의 닉네임이 "${oldNickname}"에서 "${newNickname}"으로 변경되었습니다.`);
        } catch (error) {
            console.error('닉네임 변경 중 오류:', error);
            message.reply('닉네임을 변경하는 중 문제가 발생했습니다.');
        }
    },
};
