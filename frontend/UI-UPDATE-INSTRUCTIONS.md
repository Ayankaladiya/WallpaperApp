# WallpaperHub UI Update Instructions

## Files Created:

1. **CategoryCarousel.jsx** - New horizontal scrolling category component
2. **HomePage.jsx** - Updated homepage with carousel and random images
3. **Header.jsx** - Updated header with centered search bar
4. **data-dictionary.md** - Complete data dictionary for MongoDB collections

---

## Implementation Steps:

### Step 1: Create Preview Images Folder

Create a `preview` folder in your `Frontend/public/` directory:

```
Frontend/
└── public/
    └── preview/
        ├── android.jpg
        ├── animals.jpg
        ├── app.jpg
        ├── art.jpg
        ├── cars.jpg
        ├── colors.jpg
        ├── company.jpg
        ├── nature.jpg
        ├── technology.jpg
        ├── space.jpg
        └── default.jpg
```

**Note:** You'll need to add actual images to this folder. Each image should be:
- Size: ~200x120px (or any 5:3 aspect ratio)
- Format: JPG or PNG
- Representative of the category

### Step 2: Copy Component Files

1. **Copy CategoryCarousel.jsx** to `Frontend/src/components/home/CategoryCarousel.jsx`
2. **Replace HomePage.jsx** at `Frontend/src/pages/HomePage.jsx`
3. **Replace Header.jsx** at `Frontend/src/components/layout/Header.jsx`

### Step 3: Update Your Backend API (if needed)

Make sure your `/api/images` endpoint supports fetching random images when no category is specified:

```javascript
// In Backend/src/controllers/imageController.js
// Modify getImages to return random images when no category specified

const getImages = async (req, res) => {
  try {
    const { category, page = 1, limit = 20 } = req.query;
    
    let query = {};
    if (category) {
      query.category = category.toLowerCase();
    }
    
    const skip = (page - 1) * limit;
    
    // If no category, get random images
    const images = category 
      ? await Image.find(query).skip(skip).limit(parseInt(limit))
      : await Image.aggregate([
          { $sample: { size: parseInt(limit) } }
        ]);
    
    const total = await Image.countDocuments(query);
    
    res.json({
      success: true,
      data: {
        images,
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
```

### Step 4: Test the New UI

1. Start your backend: `cd Backend && npm run dev`
2. Start your frontend: `cd Frontend && npm run dev`
3. Visit `http://localhost:3000`

You should see:
- ✅ Centered search bar in header
- ✅ Horizontal scrolling category carousel
- ✅ "Download Free Wallpapers" section with random images
- ✅ Masonry grid layout for images

---

## Key Features:

### CategoryCarousel Component:
- **Horizontal scroll** with mouse/touch
- **Scroll buttons** (arrows) appear on hover
- **Smooth scrolling** animation
- **Category images** from /preview folder
- **Gradient overlay** with category name
- **Hover effects** for better UX
- **Click to navigate** to category page

### Updated HomePage:
- **Two sections**: Categories carousel + Random images
- **Search integration** - shows results when searching
- **Clean layout** matching Unsplash style
- **Responsive** (works on all screen sizes)

### Updated Header:
- **Centered search bar** (max-width 2xl)
- **Focus effects** (border color changes)
- **Clear button** (X icon when typing)
- **Debounced search** (500ms delay)
- **Sticky header** (stays at top while scrolling)

---

## Customization Options:

### Change Carousel Scroll Amount:
```javascript
// In CategoryCarousel.jsx, line ~11
const scrollAmount = 250; // Change to 300, 400, etc.
```

### Change Number of Random Images:
```javascript
// In HomePage.jsx, line ~27
queryFn: () => getImagesByCategory('', 1, 12), // Change 12 to 20, 30, etc.
```

### Change Category Card Size:
```javascript
// In CategoryCarousel.jsx, line ~54
className="min-w-[200px] h-[120px]..." // Change dimensions
```

### Add More Categories to Image Map:
```javascript
// In CategoryCarousel.jsx, lines ~21-32
const imageMap = {
  'android': '/preview/android.jpg',
  'animals': '/preview/animals.jpg',
  // Add more mappings here
  'yourcategory': '/preview/yourcategory.jpg',
};
```

---

## Fallback Images:

If a preview image is missing, the component will show a colored placeholder:
- Colors rotate randomly: Blue, Purple, Pink, Teal, Orange
- No broken image icons
- Graceful degradation

---

## CSS Notes:

The carousel uses custom CSS to hide scrollbars:
```css
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
```

This is already included in the CategoryCarousel component via `<style jsx>`.

---

## Troubleshooting:

**Issue: Categories not showing**
- Check API is returning categories correctly
- Verify `useCategories` hook is working
- Check browser console for errors

**Issue: Preview images not loading**
- Verify images are in `public/preview/` folder
- Check image filenames match category names
- Ensure images are lowercase (e.g., `cars.jpg` not `Cars.jpg`)

**Issue: Search not working**
- Check Header.jsx is using the updated version
- Verify debounce is installed: `npm list lodash.debounce`
- Check navigation URL in browser

**Issue: Carousel not scrolling**
- Check if categories array has items
- Verify ref is attached to scroll container
- Test scroll buttons appear on hover

---

## Next Steps (Optional Enhancements):

1. **Add category statistics** - Show image count on carousel cards
2. **Implement drag-to-scroll** - Allow mouse drag on carousel
3. **Add keyboard navigation** - Arrow keys to scroll carousel
4. **Lazy load carousel images** - Load images as they come into view
5. **Add animation** - Slide-in effect when page loads
6. **Implement favorites** - Heart icon on images (requires authentication)

---

## Data Dictionary Usage:

The `data-dictionary.md` file is ready to copy into your college report:

1. Open the file
2. Copy the content
3. Paste into your Word document under section **5.2 Data Dictionary**
4. Adjust table formatting in Word if needed
5. The tables follow the same format as your example image

---

**Your WallpaperHub now has a modern, Unsplash-inspired UI!** 🎉
