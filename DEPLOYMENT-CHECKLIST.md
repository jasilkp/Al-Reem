# Cloudflare Pages Deployment Checklist

## Pre-Deployment
- [x] Extended mobile breakpoints from 640px → 768px
- [x] Extended navigation breakpoint from 808px → 820px
- [x] Added documentation for changes

## Deployment Steps

### 1. Commit Changes
```bash
git add assets/css/mobile-overrides.css
git add LARGE-PHONE-FIX.md
git add DEPLOYMENT-CHECKLIST.md
git commit -m "Fix: Extended mobile breakpoints for large phones (Redmi Note 9 Pro)"
```

### 2. Push to Repository
```bash
git push origin main
```

### 3. Cloudflare Pages
- Deployment should trigger automatically
- Wait for build to complete
- Check deployment logs for any CSS errors

### 4. Clear Cache (Important!)
In Cloudflare Dashboard:
- Go to your Pages project
- Navigate to "Caching" or "Purge Cache"
- Purge all cache to ensure new CSS is served

## Post-Deployment Testing

### Test Devices (in priority order)

#### 1. Redmi Note 9 Pro (PRIMARY)
- Viewport: ~393px CSS width
- Open: https://your-site.pages.dev
- **Check:**
  - [ ] Shows hamburger menu (NOT desktop nav links)
  - [ ] Circular Why Choose Us icons
  - [ ] Full-width hero video
  - [ ] No vertical "Get in touch" text
  - [ ] Centered content
  - [ ] Two-column outlet grid

#### 2. iPhone 14 Pro Max
- Viewport: ~428px CSS width
- Same checks as above

#### 3. Samsung Galaxy A6 (Regression Test)
- Viewport: ~360px CSS width
- **Verify:** Still works as before (should not break)

#### 4. Desktop (Regression Test)
- Viewport: 1920px width
- **Verify:** Desktop layout unchanged

### Testing Tools

#### Browser DevTools (Quick Test)
```
Chrome DevTools → Device Toolbar → Responsive
Test these widths:
- 360px (small phone)
- 393px (Redmi Note 9 Pro)
- 414px (iPhone Pro Max)
- 428px (larger phones)
- 768px (tablet - should be tablet layout)
- 1024px (desktop)
```

#### Real Device Testing (Recommended)
1. Open on actual Redmi Note 9 Pro
2. Hard refresh: Hold refresh button → "Empty Cache and Hard Reload"
3. Check all sections scroll through entire page

## Success Criteria

### ✅ Large Phones Should Show:
- Mobile hamburger menu
- Circular icons in Why Choose section
- Enlarged/cropped hero video
- Clean layout without desktop elements
- Proper mobile spacing and typography

### ❌ Should NOT Show:
- Desktop horizontal navigation
- Vertical rail text
- Tablet-wide layouts
- Desktop-sized images

## Troubleshooting

### Issue: Still shows desktop layout on large phone
**Solution:**
1. Hard refresh (Ctrl+Shift+R)
2. Clear browser cache
3. Check Cloudflare cache was purged
4. Wait 5-10 minutes for CDN propagation

### Issue: Small phones now broken
**Solution:**
- Check if 640px and 420px breakpoints are still intact
- Smaller breakpoints should NOT have been changed

### Issue: Tablet shows mobile layout
**Solution:**
- This is expected between 768px-820px
- Tablets (>820px) should show desktop/tablet layout

## Rollback Plan
If critical issues occur:

```bash
# Revert the commit
git revert HEAD

# Or restore specific file
git checkout HEAD~1 assets/css/mobile-overrides.css

# Push rollback
git push origin main
```

## Notes
- CSS changes are in `assets/css/mobile-overrides.css`
- No JavaScript changes required
- No HTML changes required
- No changes to other CSS files

## Sign-off
- [ ] Tested on Redmi Note 9 Pro - Mobile layout works
- [ ] Tested on small phone - No regression
- [ ] Tested on desktop - No regression
- [ ] Cache cleared
- [ ] All sections verified

---
**Last Updated:** 2025-11-06
**Issue:** Large phones getting desktop layout
**Fix:** Extended mobile breakpoints to 768px/820px
