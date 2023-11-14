import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import * as OBC from "openbim-components";
import "./App.css";
import { loadModel } from "./loader";
function App() {
	const containerRef = useRef<HTMLDivElement | null>(null);
	useEffect(() => {
		const components = new OBC.Components();
		initScene(components, containerRef.current!);
		return () => {
			components.dispose();
		};
	}, []);

	return <div className="full-screen" ref={containerRef}></div>;
}

function initScene(components: OBC.Components, container: HTMLDivElement) {
	components.scene = new OBC.SimpleScene(components);
	components.renderer = new OBC.PostproductionRenderer(components, container);
	components.camera = new OBC.SimpleCamera(components);
	components.raycaster = new OBC.SimpleRaycaster(components);

	components.init();

	(components.renderer as OBC.PostproductionRenderer).postproduction.enabled = true;

	const scene = components.scene.get();

	(components.camera as OBC.SimpleCamera).controls.setLookAt(12, 6, 8, 0, 0, -10);

	const grid = new OBC.SimpleGrid(components, new THREE.Color(0x666666));
	components.tools.add("grid", grid);
	const customEffects = (components.renderer as OBC.PostproductionRenderer).postproduction.customEffects;
	customEffects.excludedMeshes.push(grid.get());

	const toolbar = new OBC.Toolbar(components);
	components.ui.addToolbar(toolbar);
	const loadButton = new OBC.Button(components);
	loadButton.materialIcon = "download";
	loadButton.tooltip = "Load model";
	toolbar.addChild(loadButton);
	loadButton.onClick.add(() => loadModel(scene));
}

export default App;
