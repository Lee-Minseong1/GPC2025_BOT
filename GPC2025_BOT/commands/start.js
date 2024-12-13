const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'start',
    description: '상위 40명 데이터를 기반으로 역할 부여를 시작합니다.',
    execute: async (message) => {
        if (!message.guild) {
            return message.reply('이 명령어는 서버에서만 사용할 수 있습니다.');
        }

        const MAIMAI_FILE = path.join(__dirname, '../transform/maimai_top40.csv');
        const SVDX_FILE = path.join(__dirname, '../transform/svdx_top40.csv');
        const TEST_ROLE_1 = '테스트1 역할 ID'; // maimai 테스트
        const TEST_ROLE_2 = '테스트2 역할 ID'; // svdx 테스트
        let successCount = 0;
        let failureCount = 0;

        try {
           
            const maimaiData = fs.readFileSync(MAIMAI_FILE, 'utf8').split('\n').slice(1);
            const svdxData = fs.readFileSync(SVDX_FILE, 'utf8').split('\n').slice(1);

            const maimaiIds = maimaiData.map(line => line.split(',')[3]?.trim());
            const svdxIds = svdxData.map(line => line.split(',')[3]?.trim());

           
            const members = await message.guild.members.fetch();

            for (const member of members.values()) {
                try {
                    if (maimaiIds.includes(member.user.username)) {
                        await member.roles.add(TEST_ROLE_1);
                        successCount++;
                        console.log(`${member.user.username}에게 테스트1 역할 부여 완료!`);
                    } else if (svdxIds.includes(member.user.username)) {
                        await member.roles.add(TEST_ROLE_2);
                        successCount++;
                        console.log(`${member.user.username}에게 테스트2 역할 부여 완료!`);
                    } else {
                        console.log(`${member.user.username}은 역할 데이터에 없습니다.`);
                        failureCount++;
                    }
                } catch (error) {
                    console.error(`역할 부여 실패: ${member.user.username}`, error);
                    failureCount++;
                }
            }

            message.reply(`역할 부여 완료. 성공: ${successCount}명, 실패: ${failureCount}명`);
        } catch (error) {
            console.error('명령어 실행 중 오류:', error);
            message.reply('역할 부여 중 문제가 발생했습니다.');
        }
    },
};
