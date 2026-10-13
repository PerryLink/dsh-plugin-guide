// Skill linkage: every CLI check cites the knowledge-base section that owns the
// rule, so an agent can keep auditing manually (the dsh-skill-pack-security
// linkage pattern). Section numbers refer to `guide/plugin-dev-guide.md` unless
// the `file` points at `SKILL.md`.
//
// Section numbers and headings are verified against the target document. A
// drifted citation is worse than a missing one: it sends the reader to a real
// section that does not state the rule. Two checks previously had no home at all
// (`redline-persona-role`, `redline-async-apply-registration`), so the rules are
// now written in the guide at §3.7 item 6 and §3.3.1 respectively.
import type { SkillRef } from './lib/report'

/** Canonical skill citation for one check id. */
export const SKILL_SECTIONS: Record<string, SkillRef> = {
  'patch-valid': { file: 'guide/plugin-dev-guide.md', section: '§2.2', heading: '三个概念、三种清单（package.json 的 `dsh` 键）' },
  'patch-ids-unique': { file: 'guide/plugin-dev-guide.md', section: '§2.3', heading: '配置分层顺序（后层覆盖前层，逐行按 `id` 整段替换 config）' },
  'manifest-bundle-patch': { file: 'guide/plugin-dev-guide.md', section: '§2.2', heading: '三个概念、三种清单（package.json 的 `dsh` 键）' },
  'manifest-main': { file: 'guide/plugin-dev-guide.md', section: '§7.3', heading: '常见坑清单' },
  'manifest-peers': { file: 'guide/plugin-dev-guide.md', section: '§7.3', heading: '常见坑清单' },
  'manifest-engines': { file: 'guide/plugin-dev-guide.md', section: '§8', heading: '规范与质量门禁（对插件作者的实际影响）' },
  'manifest-files': { file: 'guide/plugin-dev-guide.md', section: '§7.1', heading: '从 GitHub 安装的 build-script 坑' },
  'manifest-package-manager': { file: 'guide/plugin-dev-guide.md', section: '§8', heading: '规范与质量门禁（对插件作者的实际影响）' },
  'display-meta': { file: 'guide/plugin-dev-guide.md', section: '§7.0.1', heading: '展示元数据与图标（0.2 世代新增的硬性交付项）' },
  'readme-five-langs': { file: 'guide/plugin-dev-guide.md', section: '§8', heading: '规范与质量门禁（对插件作者的实际影响）' },
  'readme-consistency': { file: 'guide/plugin-dev-guide.md', section: '§8', heading: '规范与质量门禁（对插件作者的实际影响）' },
  'redline-persona-role': { file: 'guide/plugin-dev-guide.md', section: '§3.7', heading: '仓库级红线（写进 AGENTS.md，违反会挂门禁）' },
  'redline-waterfall-next': { file: 'guide/plugin-dev-guide.md', section: '§3.5', heading: '事件（Events）' },
  'redline-no-hardcoded-tunables': { file: 'guide/plugin-dev-guide.md', section: '§3.6', heading: '配置（Config）' },
  'redline-effect-registration': { file: 'guide/plugin-dev-guide.md', section: '§3.3', heading: '注册即 effect' },
  'redline-async-apply-registration': { file: 'guide/plugin-dev-guide.md', section: '§3.3.1', heading: 'async `apply()` 的注册顺序（最容易写成静默缺陷的一条）' },
}

/** Fallback citation for any check id not in the table. */
export function skillRefFor(id: string): SkillRef {
  return SKILL_SECTIONS[id] ?? { file: 'guide/plugin-dev-guide.md', section: '§10', heading: '从零到发布的标准路径' }
}
