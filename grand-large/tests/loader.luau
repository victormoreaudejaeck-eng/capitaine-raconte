--!strict
-- Charge les modules Roblox (style `require(script.Parent.X)`) sous Lune,
-- en simulant l'arbre d'instances à partir des dossiers (sémantique Rojo).

local fs = require("@lune/fs")
local luau = require("@lune/luau")

local Loader = {}

type Node = { __path: string, __kind: "file" | "dir" }

local cache: { [string]: any } = {}
-- Index des fichiers/dossiers construit à l'avance (fs est asynchrone sous Lune
-- et ne peut pas être appelé depuis un métaméthode).
local files: { [string]: boolean } = {}
local dirs: { [string]: boolean } = {}

local function scan(path: string)
	dirs[path] = true
	for _, name in fs.readDir(path) do
		local full = path .. "/" .. name
		if fs.isDir(full) then
			scan(full)
		else
			files[full] = true
		end
	end
end
local nodeMeta: any = {}

local function makeNode(path: string, kind: "file" | "dir"): Node
	return setmetatable({ __path = path, __kind = kind }, nodeMeta) :: any
end

local function parentOf(path: string): string
	return (string.match(path, "^(.*)/[^/]+$") or ".") :: string
end

nodeMeta.__index = function(self: Node, key: string)
	local path = rawget(self :: any, "__path")
	local kind = rawget(self :: any, "__kind")
	if key == "Parent" then
		if kind == "file" then
			return makeNode(parentOf(path), "dir")
		else
			return makeNode(parentOf(path), "dir")
		end
	elseif key == "Name" then
		return (string.match(path, "([^/]+)$") or path):gsub("%.luau$", "")
	end
	local base = if kind == "file" then parentOf(path) else path
	if kind == "file" then
		error("un ModuleScript fichier n'a pas d'enfant : " .. key)
	end
	if files[base .. "/" .. key .. ".luau"] then
		return makeNode(base .. "/" .. key .. ".luau", "file")
	elseif dirs[base .. "/" .. key] then
		return makeNode(base .. "/" .. key, "dir")
	end
	error("introuvable : " .. base .. "/" .. key)
end

local robloxRequire: (any) -> any

robloxRequire = function(node: any): any
	local path = rawget(node, "__path")
	local kind = rawget(node, "__kind")
	local file = if kind == "dir" then path .. "/init.luau" else path
	if cache[file] ~= nil then
		return cache[file]
	end
	local src = fs.readFile(file)
	local fn = luau.load(src, {
		debugName = file,
		environment = { script = node, require = robloxRequire },
	})
	local result = fn()
	cache[file] = result
	return result
end

function Loader.root(path: string): any
	scan(path)
	return makeNode(path, "dir")
end

Loader.require = robloxRequire

return Loader
