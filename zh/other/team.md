---
layout: page
---

<script setup>
import {
  VPTeamPage,
  VPTeamPageTitle,
  VPTeamMembers,
  VPTeamPageSection
} from 'vitepress/theme'

const coreMembers = [
  {
    avatar: 'https://github.com/future0923.png',
    name: 'future',
    title: 'Creator',
    links: [
      { icon: 'github', link: 'https://github.com/future0923' },
      { icon: 'gitee', link: 'https://gitee.com/future94' }
    ]
  },
]

const partners = [
  {
    avatar: 'https://github.com/ayuayue.png',
    name: 'caoayu',
    title: 'title',
    org: '组织',
    orgLink: '组织的 URL',
    desc: '成员的描述',
    links: [
      { icon: 'github', link: 'https://github.com/ayuayue' },
    ]
  },
{
    avatar: 'https://github.com/wangqiqi95.png',
    name: 'Doloris Crona',
    title: 'Creator',
    links: [
      { icon: 'github', link: 'https://github.com/wangqiqi95' },
    ]
  },
]

</script>

<VPTeamPage>
    <VPTeamPageSection>
        <template #title>Project Management Committee</template>
        <template #lead>对项目的演进和发展做出显著贡献的个人</template>
        <template #members>
            <VPTeamMembers size="small" :members="coreMembers" />
        </template>
    </VPTeamPageSection>
    <VPTeamPageSection>
        <template #title>Committer</template>
        <template #lead>具有仓库写权限的个人</template>
        <template #members>
            <VPTeamMembers size="small" :members="partners" />
        </template>
    </VPTeamPageSection>
</VPTeamPage>