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
export function getSvCardComponentLayoutClasses(borderRadiusInheritProp?: string | null, cardContent: SvCardContent | null = null, component?: 'header' | 'content' | 'footer' | 'actions_start' | 'actions_end' | 'actions_startH' | 'actions_endH' | 'media_start' | 'media_end' | 'media_cover') {
  let borderRadiusInherit = String(borderRadiusInheritProp ?? '');

  const hasActionsV = cardContent?.actions.start === true || cardContent?.actions.end === true;
  const hasActionsH = cardContent?.actions.startH === true || cardContent?.actions.endH === true;
  const hasActions = hasActionsV === true || hasActionsH === true;

  if (borderRadiusInherit === 'all') {
    borderRadiusInherit = 'ss_se_es_ee';
  } else if (borderRadiusInherit.trim() === '' && cardContent != null && component != null) {
    borderRadiusInherit = '';

    if (component === 'header') {
      if (cardContent.layout === 'vertical') {
        if (cardContent.media.start === false) {
          borderRadiusInherit += '_ss_se';
        }

        if (cardContent.content === false && hasActions === false && cardContent.footer === false && cardContent.media.end === false) {
          borderRadiusInherit += '_es_ee';
        }
      } else if (cardContent.layout === 'horizontal') {
        const noContentBelow = cardContent.content === false && cardContent.footer === false && hasActionsH === false;
        if (cardContent.media.start === false && cardContent.actions.start === false) {
          borderRadiusInherit += '_ss';

          if (noContentBelow) {
            borderRadiusInherit += '_es';
          }
        }

        if (cardContent.media.end === false && cardContent.actions.end === false) {
          borderRadiusInherit += '_se';

          if (noContentBelow) {
            borderRadiusInherit += '_ee';
          }
        }
      }
    } else if (component === 'content') {
      if (cardContent.layout === 'vertical') {
        if (cardContent.media.start === false && cardContent.header === false && cardContent.actions.start === false) {
          borderRadiusInherit += '_ss_se';
        }

        if (cardContent.actions.end === false && cardContent.footer === false && cardContent.media.end === false) {
          borderRadiusInherit += '_es_ee';
        }
      } else if (cardContent.layout === 'horizontal') {
        const noContentBelow = cardContent.footer === false && cardContent.actions.endH === false;
        if (cardContent.media.start === false && cardContent.actions.start === false) {
          if (cardContent.header === false && cardContent.actions.startH === false) {
            borderRadiusInherit += '_ss';
          }

          if (noContentBelow) {
            borderRadiusInherit += '_es';
          }
        }

        if (cardContent.media.end === false && cardContent.actions.end === false) {
          if (cardContent.header === false && cardContent.actions.startH === false) {
            borderRadiusInherit += '_se';
          }

          if (noContentBelow) {
            borderRadiusInherit += '_ee';
          }
        }
      }
    } else if (component === 'footer') {
      if (cardContent.layout === 'vertical') {
        if (cardContent.media.end === false) {
          borderRadiusInherit += '_es_ee';
        }

        if (cardContent.header === false && cardContent.content === false && hasActions === false && cardContent.media.start === false) {
          borderRadiusInherit += '_ss_se';
        }
      } else if (cardContent.layout === 'horizontal') {
        const noContentAbove = cardContent.header === false && cardContent.content === false && hasActionsH === false;
        if (cardContent.media.start === false && cardContent.actions.start === false) {
          borderRadiusInherit += '_es';

          if (noContentAbove) {
            borderRadiusInherit += '_ss';
          }
        }

        if (cardContent.media.end === false && cardContent.actions.end === false) {
          borderRadiusInherit += '_ee';

          if (noContentAbove) {
            borderRadiusInherit += '_se';
          }
        }
      }
    } else if (component.startsWith('actions')) {
      if (cardContent.layout === 'vertical') {
        if (cardContent.actions.start === true) {
          if (cardContent.media.start === false && cardContent.header === false) {
            borderRadiusInherit += '_ss_se';
          }

          if (cardContent.content === false && cardContent.footer === false && cardContent.media.end === false) {
            borderRadiusInherit += '_es_ee';
          }
        } else if (cardContent.actions.end === true) {
          if (cardContent.media.start === false && cardContent.header === false && cardContent.content === false) {
            borderRadiusInherit += '_ss_se';
          }

          if (cardContent.footer === false && cardContent.media.end === false) {
            borderRadiusInherit += '_es_ee';
          }
        }
      } else {
        if (cardContent.actions.start === true) {
          if (cardContent.media.start === false) {
            borderRadiusInherit += '_ss_es';
          }

          if (cardContent.header === false && cardContent.content === false && cardContent.footer === false && cardContent.media.end === false) {
            borderRadiusInherit += '_se_ee';
          }
        } else if (cardContent.actions.end === true) {
          if (cardContent.media.end === false) {
            borderRadiusInherit += '_se_ee';
          }

          if (cardContent.header === false && cardContent.content === false && cardContent.footer === false && cardContent.media.start === false) {
            borderRadiusInherit += '_ss_es';
          }
        } else if (cardContent.actions.startH === true) {
          const noContentBelow = cardContent.content === false && cardContent.footer === false;
          if (cardContent.media.start === false) {
            if (cardContent.header === false) {
              borderRadiusInherit += '_ss';
            }

            if (noContentBelow) {
              borderRadiusInherit += '_es';
            }
          }

          if (cardContent.media.end === false) {
            if (cardContent.header === false) {
              borderRadiusInherit += '_se';
            }

            if (noContentBelow) {
              borderRadiusInherit += '_ee';
            }
          }
        } else if (cardContent.actions.endH === true) {
          const noContentAbove = cardContent.header === false && cardContent.content === false;
          if (cardContent.media.start === false) {
            if (cardContent.footer === false) {
              borderRadiusInherit += '_es';
            }

            if (noContentAbove) {
              borderRadiusInherit += '_ss';
            }
          }

          if (cardContent.media.end === false) {
            if (cardContent.footer === false) {
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
      } else if (cardContent.layout === 'vertical') {
        if (component === 'media_start') {
          borderRadiusInherit += '_ss_se';

          if (cardContent.header === false && cardContent.content === false && hasActions && cardContent.footer === false) {
            borderRadiusInherit += '_es_ee';
          }
        }

        if (component === 'media_end') {
          borderRadiusInherit += '_es_ee';

          if (cardContent.header === false && cardContent.content === false && hasActions && cardContent.footer === false) {
            borderRadiusInherit += '_ss_se';
          }
        }
      } else {
        if (component === 'media_start') {
          borderRadiusInherit += '_ss_es';

          if (cardContent.header === false && cardContent.content === false && hasActions && cardContent.footer === false) {
            borderRadiusInherit += '_se_ee';
          }
        }

        if (component === 'media_end') {
          borderRadiusInherit += '_se_ee';

          if (cardContent.header === false && cardContent.content === false && hasActions && cardContent.footer === false) {
            borderRadiusInherit += '_ss_es';
          }
        }
      }
    }
  }

  const padding: string[] = [];

  if (cardContent != null) {
    if (component === 'header') {
      if (cardContent.layout === 'vertical') {
        if (hasActions === false && cardContent.content === false && cardContent.footer === false && cardContent.media.end === false) {
          padding.push('sv-card--pad-block-end');
        }
      } else if (cardContent.layout === 'horizontal') {
        if (hasActionsH === false && cardContent.content === false && cardContent.footer === false) {
          padding.push('sv-card--pad-block-end');
        }
      }
    } else if (component === 'content') {
      if (cardContent.layout === 'vertical') {
        if (cardContent.media.start === false && cardContent.header === false && cardContent.actions.start === false) {
          padding.push('sv-card--pad-block-start');
        }

        if (cardContent.actions.end === false && cardContent.footer === false && cardContent.media.end === false) {
          padding.push('sv-card--pad-block-end');
        }
      } else if (cardContent.layout === 'horizontal') {
        if (cardContent.header === false && cardContent.actions.startH === false) {
          padding.push('sv-card--pad-block-start');
        }

        if (cardContent.actions.endH === false && cardContent.footer === false) {
          padding.push('sv-card--pad-block-end');
        }
      }
    }
  }

  return borderRadiusInherit
    .split(/[^es]/)
    .map((s) => s.trim())
    .filter((s) => s.length === 2)
    .map((s) => `${ classPrefixBorder }${ s }`)
    .concat(padding);
}
