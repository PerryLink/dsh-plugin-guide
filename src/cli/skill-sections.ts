// Skill linkage: every CLI check cites the knowledge-base section that owns the
// rule, so an agent can keep auditing manually (the dsh-skill-pack-security
// linkage pattern). Section numbers refer to `guide/plugin-dev-guide.md` unless
// the `file` points at `SKILL.md`.
import type { SkillRef } from './lib/report'

/** Canonical skill citation for one check id. */
export const SKILL_SECTIONS: Record<string, SkillRef> = {
  'patch-valid': { file: 'guide/plugin-dev-guide.md', section: '§2.2', heading: '两个概念、两种清单（bundle manifest）' },
  'patch-ids-unique': { file: 'guide/plugin-dev-guide.md', section: '§2.3', heading: '配置分层顺序（按 id 整行覆盖）' },
  'manifest-bundle-patch': { file: 'guide/plugin-dev-guide.md', section: '§2.2', heading: 'bundle 最小结构（dsh.bundle.patch）' },
  'manifest-main': { file: 'guide/plugin-dev-guide.md', section: '§7.3', heading: 'main/types 指向 lib 产物' },
  'manifest-peers': { file: 'guide/plugin-dev-guide.md', section: '§7.3', heading: 'cordis 双副本与 peer 对齐宿主' },
  'manifest-engines': { file: 'guide/plugin-dev-guide.md', section: '§8', heading: '规范与质量门禁（Node 版本）' },
  'manifest-files': { file: 'guide/plugin-dev-guide.md', section: '§7.1', heading: 'files 白名单与构建产物' },
  'manifest-package-manager': { file: 'guide/plugin-dev-guide.md', section: '§8', heading: 'packageManager 固定 pnpm' },
  'readme-five-langs': { file: 'guide/plugin-dev-guide.md', section: '§8', heading: '文档双语/多语成对' },
  'readme-consistency': { file: 'guide/plugin-dev-guide.md', section: '§8', heading: '五语 README 同步' },
  'redline-persona-role': { file: 'SKILL.md', section: '§边界', heading: '注入提示词段落以角色句开头、保持短小' },
  'redline-waterfall-next': { file: 'guide/plugin-dev-guide.md', section: '§3.5', heading: 'waterfall 铁律：必须调用 next()' },
  'redline-no-hardcoded-tunables': { file: 'guide/plugin-dev-guide.md', section: '§3.6', heading: '配置 Schema 化、不硬编码可调参数' },
  'redline-effect-registration': { file: 'guide/plugin-dev-guide.md', section: '§3.3', heading: '注册即 effect（disposer 可逆）' },
}

/** Fallback citation for any check id not in the table. */
export function skillRefFor(id: string): SkillRef {
  return SKILL_SECTIONS[id] ?? { file: 'guide/plugin-dev-guide.md', section: '§10', heading: '从零到发布的标准路径' }
}
