import type { SvCardContent } from './symbols';

/**
 * What border radius should the card component inherit.
 * You can use a string like `<token>[_<token>]` where `<token>` is one of:
 * - 'ss' - block-start / inline-start
 * - 'se' - block-start / inline-end
 * - 'es' - block-end / inline-start
 * - 'es' - block-end / inline-end
 * These directions do not account for card `layout`.
 *
 * By default it tries to auto-detect the right corners from the content of the SvCard.
 * But if the detection fails, set `border-radius-inherit`.
 *
 * @public
 * @defaultValue null
 */
export type SvCardComponentBorderRadiusInheritProp = 'all' | 'none' | string | null;

const classPrefixBorder = 'sv-card--border-radius-inherit-';
export function getSvCardComponentBorderRadiusInheritClasses(borderRadiusInheritProp?: string | null, config: SvCardContent | null = null, component?: 'header' | 'content' | 'footer' | 'actions_start' | 'actions_end' | 'actions_startH' | 'actions_endH' | 'media_start' | 'media_end' | 'media_cover') {
  let borderRadiusInherit = String(borderRadiusInheritProp ?? '');

  if (borderRadiusInherit === 'all') {
    borderRadiusInherit = 'ss_se_es_ee';
  } else if (borderRadiusInherit.trim() === '' && config != null && component != null) {
    borderRadiusInherit = '';
    const hasActionsV = config.actions.start === true || config.actions.end === true;
    const hasActionsH = config.actions.startH === true || config.actions.endH === true;
    const hasActions = hasActionsV === true || hasActionsH === true;

    if (component === 'header') {
      if (config.layout === 'vertical') {
        if (config.media.start === false) {
          borderRadiusInherit += '_ss_se';
        }

        if (config.content === false && hasActions === false && config.footer === false && config.media.end === false) {
          borderRadiusInherit += '_es_ee';
        }
      } else if (config.layout === 'horizontal') {
        const noContentBelow = config.content === false && config.footer === false && hasActionsH === false;
        if (config.media.start === false && config.actions.start === false) {
          borderRadiusInherit += '_ss';

          if (noContentBelow) {
            borderRadiusInherit += '_es';
          }
        }

        if (config.media.end === false && config.actions.end === false) {
          borderRadiusInherit += '_se';

          if (noContentBelow) {
            borderRadiusInherit += '_ee';
          }
        }
      }
    } else if (component === 'content') {
      if (config.layout === 'vertical') {
        if (config.media.start === false && config.header === false && config.actions.start === false) {
          borderRadiusInherit += '_ss_se';
        }

        if (config.actions.end === false && config.footer === false && config.media.end === false) {
          borderRadiusInherit += '_es_ee';
        }
      } else if (config.layout === 'horizontal') {
        const noContentBelow = config.footer === false && config.actions.endH === false;
        if (config.media.start === false && config.actions.start === false) {
          if (config.header === false && config.actions.startH === false) {
            borderRadiusInherit += '_ss';
          }

          if (noContentBelow) {
            borderRadiusInherit += '_es';
          }
        }

        if (config.media.end === false && config.actions.end === false) {
          if (config.header === false && config.actions.startH === false) {
            borderRadiusInherit += '_se';
          }

          if (noContentBelow) {
            borderRadiusInherit += '_ee';
          }
        }
      }
    } else if (component === 'footer') {
      if (config.layout === 'vertical') {
        if (config.media.end === false) {
          borderRadiusInherit += '_es_ee';
        }

        if (config.header === false && config.content === false && hasActions === false && config.media.start === false) {
          borderRadiusInherit += '_ss_se';
        }
      } else if (config.layout === 'horizontal') {
        const noContentAbove = config.header === false && config.content === false && hasActionsH === false;
        if (config.media.start === false && config.actions.start === false) {
          borderRadiusInherit += '_es';

          if (noContentAbove) {
            borderRadiusInherit += '_ss';
          }
        }

        if (config.media.end === false && config.actions.end === false) {
          borderRadiusInherit += '_ee';

          if (noContentAbove) {
            borderRadiusInherit += '_se';
          }
        }
      }
    } else if (component.startsWith('actions')) {
      if (config.layout === 'vertical') {
        if (config.actions.start === true) {
          if (config.media.start === false && config.header === false) {
            borderRadiusInherit += '_ss_se';
          }

          if (config.content === false && config.footer === false && config.media.end === false) {
            borderRadiusInherit += '_es_ee';
          }
        } else if (config.actions.end === true) {
          if (config.media.start === false && config.header === false && config.content === false) {
            borderRadiusInherit += '_ss_se';
          }

          if (config.footer === false && config.media.end === false) {
            borderRadiusInherit += '_es_ee';
          }
        }
      } else {
        if (config.actions.start === true) {
          if (config.media.start === false) {
            borderRadiusInherit += '_ss_es';
          }

          if (config.header === false && config.content === false && config.footer === false && config.media.end === false) {
            borderRadiusInherit += '_se_ee';
          }
        } else if (config.actions.end === true) {
          if (config.media.end === false) {
            borderRadiusInherit += '_se_ee';
          }

          if (config.header === false && config.content === false && config.footer === false && config.media.start === false) {
            borderRadiusInherit += '_ss_es';
          }
        } else if (config.actions.startH === true) {
          const noContentBelow = config.content === false && config.footer === false;
          if (config.media.start === false) {
            if (config.header === false) {
              borderRadiusInherit += '_ss';
            }

            if (noContentBelow) {
              borderRadiusInherit += '_es';
            }
          }

          if (config.media.end === false) {
            if (config.header === false) {
              borderRadiusInherit += '_se';
            }

            if (noContentBelow) {
              borderRadiusInherit += '_ee';
            }
          }
        } else if (config.actions.endH === true) {
          const noContentAbove = config.header === false && config.content === false;
          if (config.media.start === false) {
            if (config.footer === false) {
              borderRadiusInherit += '_es';
            }

            if (noContentAbove) {
              borderRadiusInherit += '_ss';
            }
          }

          if (config.media.end === false) {
            if (config.footer === false) {
              borderRadiusInherit += '_ee';
            }

            if (noContentAbove) {
              borderRadiusInherit += '_es';
            }
          }
        }
      }
    } else if (component.startsWith('media')) {
      if (component === 'media_cover') {
        borderRadiusInherit = 'ss_se_es_ee';
      } else if (config.layout === 'vertical') {
        if (component === 'media_start') {
          borderRadiusInherit += '_ss_se';

          if (config.header === false && config.content === false && hasActions && config.footer === false) {
            borderRadiusInherit += '_es_ee';
          }
        }

        if (component === 'media_end') {
          borderRadiusInherit += '_es_ee';

          if (config.header === false && config.content === false && hasActions && config.footer === false) {
            borderRadiusInherit += '_ss_se';
          }
        }
      } else {
        if (component === 'media_start') {
          borderRadiusInherit += '_ss_es';

          if (config.header === false && config.content === false && hasActions && config.footer === false) {
            borderRadiusInherit += '_se_ee';
          }
        }

        if (component === 'media_end') {
          borderRadiusInherit += '_se_ee';

          if (config.header === false && config.content === false && hasActions && config.footer === false) {
            borderRadiusInherit += '_ss_es';
          }
        }
      }
    }
  }

  return borderRadiusInherit
    .split(/[^es]/)
    .map((s) => s.trim())
    .filter((s) => s.length === 2)
    .map((s) => `${ classPrefixBorder }${ s }`);
}
