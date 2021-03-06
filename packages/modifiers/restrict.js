import * as is   from '@interactjs/utils/is';
import rectUtils from '@interactjs/utils/rect';

function start ({ rect, startOffset, status }) {
  const { options } = status;
  const { elementRect } = options;
  const offset = {};

  if (rect && elementRect) {
    offset.left = startOffset.left - (rect.width  * elementRect.left);
    offset.top  = startOffset.top  - (rect.height * elementRect.top);

    offset.right  = startOffset.right  - (rect.width  * (1 - elementRect.right));
    offset.bottom = startOffset.bottom - (rect.height * (1 - elementRect.bottom));
  }
  else {
    offset.left = offset.top = offset.right = offset.bottom = 0;
  }

  status.offset = offset;
}

function set ({ coords, interaction, status }) {
  const { options, offset } = status;

  const restriction = getRestrictionRect(options.restriction, interaction, coords);

  if (!restriction) { return status; }

  const rect = restriction;

  // object is assumed to have
  // x, y, width, height or
  // left, top, right, bottom
  if ('x' in restriction && 'y' in restriction) {
    coords.x = Math.max(Math.min(rect.x + rect.width  - offset.right , coords.x), rect.x + offset.left);
    coords.y = Math.max(Math.min(rect.y + rect.height - offset.bottom, coords.y), rect.y + offset.top );
  }
  else {
    coords.x = Math.max(Math.min(rect.right  - offset.right , coords.x), rect.left + offset.left);
    coords.y = Math.max(Math.min(rect.bottom - offset.bottom, coords.y), rect.top  + offset.top );
  }
}

function getRestrictionRect (value, interaction, coords) {
  if (is.func(value)) {
    return rectUtils.resolveRectLike(value, interaction.target, interaction.element, [coords.x, coords.y, interaction]);
  } else {
    return rectUtils.resolveRectLike(value, interaction.target, interaction.element);
  }
}

const restrict = {
  start,
  set,
  getRestrictionRect,
  defaults: {
    restriction: null,
    elementRect: null,
  },
};

export default restrict;
