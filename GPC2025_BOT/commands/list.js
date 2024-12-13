const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'list',
    description: '리그별 상위 멤버 출력 및및 역할 부여.',
    execute: async (message) => {
        console.log('list 명령어 실행 시작');

        if (!message.guild) {
            console.log('서버 외에서 실행됨');
            return message.reply('서버 확인 필요.');
        }
      
        const MAIMAI_FILE = path.join(__dirname, '../transform/maimai_top100.csv');
        const SVDX_FILE = path.join(__dirname, '../transform/svdx_top100.csv');

        try {
            console.log('멤버 목록 가져오는 중...');
            const members = await message.guild.members.fetch();
            console.log(`멤버 수: ${members.size}`);
           
            const maimaiData = fs.readFileSync(MAIMAI_FILE, 'utf8').split('\n').slice(1);
            const maimaiTop100 = maimaiData.map(line => {
                const [ingame, name, rating, id] = line.split(',');
                return { ingame, name, rating: parseFloat(rating), id: id?.trim() };
            }).filter(user => user.id).sort((a, b) => b.rating - a.rating);

            const maimaiChallenger = maimaiTop100.slice(0, 16);
            const maimaiMaster = maimaiTop100.slice(16, 48);
            const maimaiDiamond = maimaiTop100.slice(48, 80);
          
            const svdxData = fs.readFileSync(SVDX_FILE, 'utf8').split('\n').slice(1);
            const svdxTop100 = svdxData.map(line => {
                const [ingame, name, rating, id] = line.split(',');
                return { ingame, name, rating: parseFloat(rating), id: id?.trim() };
            }).filter(user => user.id).sort((a, b) => b.rating - a.rating);

            const svdxChallenger = svdxTop100.slice(0, 16);
            const svdxMaster = svdxTop100.slice(16, 48);
            const svdxDiamond = svdxTop100.slice(48, 80);
            const svdxPlatinum = svdxTop100.slice(80, 112);
         
            const roles = {
                maimaiChallenger: message.guild.roles.cache.find(role => role.name === '마이마이-챌린저리그'),
                maimaiMaster: message.guild.roles.cache.find(role => role.name === '마이마이-마스터리그'),
                maimaiDiamond: message.guild.roles.cache.find(role => role.name === '마이마이-다이아리그'),
                svdxChallenger: message.guild.roles.cache.find(role => role.name === '사볼-챌린저리그'),
                svdxMaster: message.guild.roles.cache.find(role => role.name === '사볼-마스터리그'),
                svdxDiamond: message.guild.roles.cache.find(role => role.name === '사볼-다이아리그'),
                svdxPlatinum: message.guild.roles.cache.find(role => role.name === '사볼-플래티넘리그'),
                maimaiPlayer: message.guild.roles.cache.find(role => role.name === '마이선수'),
                svdxPlayer: message.guild.roles.cache.find(role => role.name === '사볼선수')
            };

            for (const [key, role] of Object.entries(roles)) {
                if (!role) {
                    return message.reply(`${key} 역할을 찾을 수 없습니다.`);
                }
            }
           
            const assignRoles = async (data, leagueRole, playerRole) => {
                let successCount = 0;
                let failureCount = 0;
                const failedUsers = [];

                for (const user of data) {
                    const member = members.find(member => member.user.username === user.id);

                    if (!member) {
                        failureCount++;
                        failedUsers.push(user);
                        console.log(`유저를 찾을 수 없습니다: ${user.id}`);
                        continue;
                    }

                    try {
                        await member.roles.add(leagueRole);
                        await member.roles.add(playerRole);
                        successCount++;
                        console.log(`역할 부여 성공: ${user.name} (${member.user.id})`);
                    } catch (error) {
                        failureCount++;
                        failedUsers.push(user);
                        console.error(`역할 부여 실패: ${user.name} (${member.user.id})`, error);
                    }
                }

                return { successCount, failureCount, failedUsers };
            };
     
            const maimaiChallengerResult = await assignRoles(maimaiChallenger, roles.maimaiChallenger, roles.maimaiPlayer);
            const maimaiMasterResult = await assignRoles(maimaiMaster, roles.maimaiMaster, roles.maimaiPlayer);
            const maimaiDiamondResult = await assignRoles(maimaiDiamond, roles.maimaiDiamond, roles.maimaiPlayer);

            const svdxChallengerResult = await assignRoles(svdxChallenger, roles.svdxChallenger, roles.svdxPlayer);
            const svdxMasterResult = await assignRoles(svdxMaster, roles.svdxMaster, roles.svdxPlayer);
            const svdxDiamondResult = await assignRoles(svdxDiamond, roles.svdxDiamond, roles.svdxPlayer);
            const svdxPlatinumResult = await assignRoles(svdxPlatinum, roles.svdxPlatinum, roles.svdxPlayer);

            const formatFailedUsers = (failedUsers) => {
                return failedUsers.map(user => `${user.name} (${user.id})`).join(', ') || '없음';
            };

            await message.channel.send(
                `**역할 부여 작업 완료**\n\n` +
                `**마이마이-챌린저리그**:\n성공: ${maimaiChallengerResult.successCount}, 실패: ${maimaiChallengerResult.failureCount}\n실패 유저: ${formatFailedUsers(maimaiChallengerResult.failedUsers)}\n\n` +
                `**마이마이-마스터리그**:\n성공: ${maimaiMasterResult.successCount}, 실패: ${maimaiMasterResult.failureCount}\n실패 유저: ${formatFailedUsers(maimaiMasterResult.failedUsers)}\n\n` +
                `**마이마이-다이아리그**:\n성공: ${maimaiDiamondResult.successCount}, 실패: ${maimaiDiamondResult.failureCount}\n실패 유저: ${formatFailedUsers(maimaiDiamondResult.failedUsers)}\n\n` +
                `**사볼-챌린저리그**:\n성공: ${svdxChallengerResult.successCount}, 실패: ${svdxChallengerResult.failureCount}\n실패 유저: ${formatFailedUsers(svdxChallengerResult.failedUsers)}\n\n` +
                `**사볼-마스터리그**:\n성공: ${svdxMasterResult.successCount}, 실패: ${svdxMasterResult.failureCount}\n실패 유저: ${formatFailedUsers(svdxMasterResult.failedUsers)}\n\n` +
                `**사볼-다이아리그**:\n성공: ${svdxDiamondResult.successCount}, 실패: ${svdxDiamondResult.failureCount}\n실패 유저: ${formatFailedUsers(svdxDiamondResult.failedUsers)}\n\n` +
                `**사볼-플래티넘리그**:\n성공: ${svdxPlatinumResult.successCount}, 실패: ${svdxPlatinumResult.failureCount}\n실패 유저: ${formatFailedUsers(svdxPlatinumResult.failedUsers)}`
            );

            console.log('역할 부여 작업 완료');
        } catch (error) {
            console.error('리그별 상위 멤버 추출 중 오류:', error);
            message.reply('데이터를 처리하는 중 문제 발생.');
        }
    },
};
