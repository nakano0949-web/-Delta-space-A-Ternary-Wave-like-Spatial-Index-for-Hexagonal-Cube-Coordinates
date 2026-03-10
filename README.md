https://doi.org/10.5281/zenodo.18941064
Delta-space is a new **ternary, wave-like spatial indexing framework** for hexagonal grids represented in cube coordinates  
\((x, y, z)\) with the constraint \(x + y + z = 0\).

Each coordinate is decomposed into **balanced ternary digits**, which are mapped to three canonical cube directions.  
This produces a **multi-scale 3‑ary tree (Delta-tree)** that supports efficient spatial search with **provable pruning guarantees**.

Delta-space provides:
- Nearest neighbor (NN) search  
- k-nearest neighbor (kNN) search  
- Range search using Delta-balls  
- Exponential lower bounds for pruning  
- A hierarchical, non-saturated spatial index for hex grids  

---

## 🔷 Key Concepts

### **Balanced Ternary → Delta-digits**
Each cube coordinate is expanded in balanced ternary \(\{-1,0,1\}\).  
Digit triples \((a,b,c)\) map to canonical directions:

| Digit triple | Direction | Delta-digit |
|--------------|-----------|-------------|
| (1, -1, 0)   | (1, -1, 0) | 0 |
| (0, 1, -1)   | (0, 1, -1) | 1 |
| (-1, 0, 1)   | (-1, 0, 1) | 2 |
| (0, 0, 0)    | None       | skip |

This yields a **prefix-based spatial code** similar to Morton/Hilbert codes, but adapted to hex geometry.

---

## 🔷 Delta-tree Structure

Delta-digits define a path in a **3‑ary tree**:

(root)
    /    |    \
  0      1      2
/ | \  / | \  / | \


- Each level corresponds to a ternary scale \(3^k\)  
- Prefix differences imply **exponential separation**  
- This gives strong pruning guarantees for NN/kNN/range search  

---

## 🔷 Example Usage (Python)

```python
from delta import DeltaTree, coord_to_delta_digits

tree = DeltaTree()

# Insert some points
pts = [(1, -1, 0), (2, -2, 0), (0, 1, -1)]
for p in pts:
    tree.insert(coord_to_delta_digits(*p), p)

# Query
d, p = tree.nn((0, 0, 0))
print("Nearest:", p, "distance:", d)

Example Usage (Python)

`python
from delta import DeltaTree, coordtodelta_digits

tree = DeltaTree()

Insert some points
pts = [(1, -1, 0), (2, -2, 0), (0, 1, -1)]
for p in pts:
    tree.insert(coordtodelta_digits(*p), p)

Query
d, p = tree.nn((0, 0, 0))
print("Nearest:", p, "distance:", d)
`

---

🔷 Delta-distance

Delta-space uses the L1-like metric on cube coordinates:

\[
d\Delta(p,q) = |xp - xq| + |yp - yq| + |zp - z_q|.
\]

This metric forms hexagonal balls (Delta-balls) and wavefront-like shells (Delta-shells).

---

🔷 Mathematical Guarantees

Delta-space includes several proven properties:

✔ Prefix difference ⇒ exponential lower bound
If the first differing digit is at depth \(d\):

\[
d_\Delta(p,q) \ge c \cdot 3^d.
\]

✔ Correct pruning for NN/kNN/range search
Any subtree with a differing prefix at depth \(k\) can be safely pruned once:

\[
c \cdot 3^k > R.
\]

✔ No “triangular blind spots”
Delta-digit regions partition the hex L1 ball exactly into 3 convex 120° sectors.

✔ Balanced ternary consistency
Lower digits cannot cancel higher-scale movement beyond a bounded amount.

---

🔷 Applications

Delta-space is useful for:

- Hex-grid search  
- Robotics (SLAM, path planning)  
- GIS and spatial analytics  
- Game development (strategy games, hex maps)  
- Multi-scale geometric indexing  
- Machine learning models requiring structured spatial search  

---

🔷 Repository Contents

- delta.py — reference implementation  
- examples/ — NN, kNN, and range search demos  
- figures/ — Delta-balls, Delta-shells, and digit diagrams  
- paper/ — full PDF of the Delta-space paper  

---

🔷 License

MIT License  
You are free to use Delta-space in research, games, robotics, or commercial applications.

---

🔷 Citation

If you use Delta-space in academic work:

`
Nakano, T. (2026). Delta-space: A Ternary Hexagonal Index for Wave-like Search on Cube Coordinates.
